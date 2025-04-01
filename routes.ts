/**
 * Các đường dẫn không cần phải xác thực
 * @type {string[]}
 */
export const publicRouters = [
    "/",
    // "/api/proofDocuments",
    "/api/public/v1/documents", // method GET /api/documents?page=[]&keyword=[]&donVi=[]&capBanHanh=[]&linhVuc=[]&loaiVanBan=[]&sort=[]
]

/**
 * Các đường dẫn trong mảng này sẽ được dùng để xác thực
 * Những router này sau đó chuyển hướng người dùng đến /settings
 * @type {string[]}
 */
export const authRouters = [
    "/auth/login",
    // "/auth/register",
]

/**
 * Xác thực API
 * @type {string[]}
 */
export const apiAuthPrefix = "/api/auth"


/**
 * Đường dẫn mặc định sau khi đăng nhập
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = `${process.env.NEXT_PUBLIC_BASE_URL}/`;