export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/api',
    authUrl: 'http://localhost:8080/auth',
    timeoutMs: 5000,
    modules: {
        basic: 'basico',
        intermediate: 'intermedio',
        advanced: 'avanzado'
    },
    defaultPagination: {
        pageSize: 10,
        currentPage: 1
    },
    uploadLimits: {
        videoMaxSize: 100 * 1024 * 1024, // 100MB
        pdfMaxSize: 10 * 1024 * 1024,    // 10MB
    }
};