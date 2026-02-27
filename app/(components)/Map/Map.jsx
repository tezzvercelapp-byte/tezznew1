"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useSearchParams, useRouter } from "next/navigation";
import "./map.css"; // CSS faylını import edirik

const CENTER_COORDINATES = [49.8670924, 40.4092617];

export default function MapComponent() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const markersRef = useRef([]); // Markerləri yadda saxlamaq üçün
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL parametrini oxuyuruq (?pb=get və ya ?pb=return)
  const pbFilter = searchParams.get("pb");

  // Filteri dəyişmək üçün funksiya
  const handleFilterChange = (filterType) => {
    const params = new URLSearchParams(searchParams);
    if (filterType) {
      params.set("pb", filterType);
    } else {
      params.delete("pb");
    }
    router.push(`?${params.toString()}`);
  };

  // Skript yükləndikdə xəritəni başlat
  useEffect(() => {
    if (isScriptLoaded && !mapInstanceRef.current && mapContainerRef.current) {
      mapInstanceRef.current = new window.mapgl.Map(mapContainerRef.current, {
        center: CENTER_COORDINATES,
        zoom: 13,
        key: "3ec128f8-2735-4c4c-966e-46bc63dab53a",
        zoomControl: "bottomRight",
      });

      // İlk yüklənmədə dataları gətir
      fetchAndRenderStations();
    }

    // Təmizlik işləri
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScriptLoaded]);

  // Filter dəyişdikdə markerləri yenilə
  useEffect(() => {
    if (mapInstanceRef.current) {
      fetchAndRenderStations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pbFilter]);

  // Window obyektinə click handler əlavə edirik (HTMLMarker üçün lazımdır)
  useEffect(() => {
    window.onStationClick = (locationId) => {
      // Datanı cache-dən və ya birbaşa tapırıq (burada sadəlik üçün fetch zamanı saxlanan datanı istifadə edəcəyik)
      // Bu funksiya aşağıda fetchAndRenderStations daxilində idarə olunacaq
      const event = new CustomEvent("station-clicked", { detail: locationId });
      window.dispatchEvent(event);
    };

    const handleStationClick = (e) => {
      const locId = e.detail;
      // Cache-dən tapmaq
      if (window.stationsDataCache && window.stationsDataCache[locId]) {
        setSelectedStation(window.stationsDataCache[locId]);
      }
    };

    window.addEventListener("station-clicked", handleStationClick);

    return () => {
      window.removeEventListener("station-clicked", handleStationClick);
      delete window.onStationClick;
    };
  }, []);

  const fetchAndRenderStations = async () => {
    try {
      // Köhnə markerləri sil
      markersRef.current.forEach((m) => m.destroy());
      markersRef.current = [];

      const res = await fetch("https://payments.tezz.az/api/map-stations/");
      const json = await res.json();

      // Qlobal cache yaradırıq (HTMLMarker-dən çatmaq üçün)
      window.stationsDataCache = {};

      for (const key in json) {
        const loc = json[key];
        if (!loc.latitude || !loc.longitude) continue;

        window.stationsDataCache[loc.location_id] = loc;

        // Filtering logic
        let hasPB = false;
        if (loc.stations) {
          loc.stations.forEach((s) => {
            if (pbFilter === "get" && s.available_powerbanks > 0) hasPB = true;
            else if (pbFilter !== "get" && s.free_slots > 0) hasPB = true;
          });
        }

        // Əgər filtrə uyğun deyilsə, keç
        if (!hasPB) continue;

        const coords = [Number(loc.longitude), Number(loc.latitude)];

        // Marker seçimi
        if (loc.location_promo_marker_icon) {
          // Promo Marker (HTML)
          const htmlContent = `
            <div class="composite-marker" onclick="onStationClick('${loc.location_id}')">
                <div class="pin-bg"></div>
                <div class="inner-icon" style="background-image: url('${loc.location_promo_marker_icon}');"></div>
            </div>`;

          // HTML Marker
          const marker = new window.mapgl.HtmlMarker(mapInstanceRef.current, {
            coordinates: coords,
            html: htmlContent,
            preventMapInteractions: false,
          });
          markersRef.current.push(marker);
        } else {
          // Standart Marker
          const marker = new window.mapgl.Marker(mapInstanceRef.current, {
            coordinates: coords,
          });
          marker.on("click", () => setSelectedStation(loc));
          markersRef.current.push(marker);
        }
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    const btn = document.getElementById("locate-me");
    if (btn) btn.innerText = "Axtarılır...";

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.longitude, pos.coords.latitude];

        // Xəritəni həmin yerə apar
        mapInstanceRef.current.setCenter(coords, { animate: true });
        mapInstanceRef.current.setZoom(16, { animate: true });

        // Əgər köhnə marker varsa sil
        if (userMarkerRef.current) userMarkerRef.current.destroy();

        // 1-ci şəkildəki kimi Qırmızı "Home" ikonu (SVG Data URI)
        const redHomeIcon =
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPHBhdGggZmlsbD0iI2ZmNDc1NyIgZD0iTTMyIDBDMTUuMyAwIDIgMTMuMyAyIDMzYzAgMTYuNSAyNiAzMSAzMCAzMSBzMzAtMTQuNSAzMC0zMUM2MiAxMy4zIDQ4LjcgMCAzMiAweiIvPgogIDxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjE4IiBmaWxsPSIjZmZmIi8+CiAgPHBhdGggZmlsbD0iIzAwNTZiMyIgZD0iTTMyIDE4TDIwIDI4djEzaDR2LTRoMTJ2NGg0VjI4TDMyIDE4eiIvPgo8L3N2Zz4=";

        // HTML Marker yaradırıq (CSS class-ları ilə)
        const htmlContent = `
            <div class="user-marker-container">
                <div class="user-marker-label">Siz buradasınız</div>
                <img src="${redHomeIcon}" class="user-marker-icon" alt="Location" />
            </div>
        `;

        userMarkerRef.current = new window.mapgl.HtmlMarker(
          mapInstanceRef.current,
          {
            coordinates: coords,
            html: htmlContent,
            preventMapInteractions: false, // Marker üzərinə klikləməyə icazə ver
          },
        );

        if (btn) btn.innerText = "📍 Yerim";
      },
      () => {
        if (btn) btn.innerText = "Geo xətası";
      },
    );
  };
  return (
    <div className="map-wrapper">
      <Script
        src="https://mapgl.2gis.com/api/js/v1"
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />

      <div ref={mapContainerRef} id="map-container" />

      {/* Kontrol Düymələri */}
      <div className="controls">
        <button
          className={`control-btn ${pbFilter === "get" ? "active" : ""}`}
          onClick={() => handleFilterChange("get")}
          disabled={pbFilter === "get"}
        >
          Götürmək
        </button>
        <button
          className={`control-btn ${pbFilter === "return" ? "active" : ""}`}
          onClick={() => handleFilterChange("return")}
          disabled={pbFilter === "return" || !pbFilter} // Default return sayılırsa
        >
          Qaytarmaq
        </button>
        <button id="locate-me" className="control-btn" onClick={handleLocateMe}>
          📍 Yerim
        </button>
      </div>

      {/* Popup Modal */}
      {selectedStation && (
        <div className="custom-popup">
          {selectedStation.location_promo_link && (
            <a
              href={selectedStation.location_promo_link}
              target="_blank"
              rel="noreferrer"
              className="popup-btn popup-promo-btn"
              title="Promo"
            ></a>
          )}

          <div
            className="popup-btn popup-close"
            onClick={() => setSelectedStation(null)}
          >
            &times;
          </div>

          {selectedStation.location_promo_media && (
            <div className="popup-video-container">
              <div className="promo-badge">🔥 AKSİYA</div>
              <video
                src={selectedStation.location_promo_media}
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          )}

          <div className="popup-content">
            <div className="popup-header">
              <div className="popup-title">
                {selectedStation.location_short_name},{" "}
                {selectedStation.location_name}
              </div>
            </div>

            <div id="stations_list">
              {selectedStation.stations &&
              selectedStation.stations.length > 0 ? (
                selectedStation.stations.map((s, index) => (
                  <div key={index} className="station-entry">
                    <div className="title">
                      Stansiya QR: {s.station_qr_code}
                    </div>
                    <div className="details">
                      Mövcud powerbanklar: <b>{s.available_powerbanks}</b>
                      <br />
                      Boş slotlar: <b>{s.free_slots}</b>
                    </div>
                  </div>
                ))
              ) : (
                <div>Stansiyalar haqqında məlumat yoxdur</div>
              )}
            </div>

            <div className="popup-footer">
              <a
                href={selectedStation.map_link || "#"}
                target="_blank"
                rel="noreferrer"
              >
                2GIS-də açmaq &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
