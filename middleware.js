import {
    NextResponse
} from "next/server";

const defaultLocale = "az";
const locales = ["az", "en"];

export function middleware(request) {
    const {
        pathname
    } = request.nextUrl;

    if (pathname.startsWith("/qr")) {
        return NextResponse.next();
    }
    if (pathname.startsWith("/offer.pdf")) {
        return NextResponse.next();
    }

    // --- DÜZELTME BURADA ---
    // "/api/" ile başlayan tüm istekleri iptal et (NextResponse.next()),
    // AMA "/api/payment-success" ise iptal ETME, aşağıya devam etsin ki dil eklensin.
    if (pathname.startsWith("/api/") &&
        !pathname.includes("/api/payment-success") &&
        !pathname.includes("/api/payment-decline") &&
        !pathname.includes("/api/payment-cancel")) {
        return NextResponse.next();
    }
    // -----------------------

    // Eğer kullanıcı zaten "/az/api/payment-success" yazmışsa, onu "/api/payment-success"e yönlendir (Temiz URL)
    if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
        const newPath = pathname.replace(`/${defaultLocale}`, "");
        return NextResponse.redirect(new URL(newPath || "/", request.url));
    }

    // Dil kodu eksikse varsayılan dilden sun (Rewrite)
    // Bu kısım çalışacak ve "/api/payment-success" isteğini
    // arka planda "/az/api/payment-success" olarak değiştirecek.
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
        return NextResponse.rewrite(
            new URL(`/${defaultLocale}${pathname}`, request.url)
        );
    }
}

export const config = {
    matcher: [
        // --- DÜZELTME BURADA ---
        // "api" kelimesini buradaki dışlananlar listesinden KALDIRDIK.
        // Artık api rotalarında da middleware tetiklenecek,
        // fakat yukarıdaki if bloğu ile gereksiz olanları hemen geçeceğiz.
        '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
    ],
};