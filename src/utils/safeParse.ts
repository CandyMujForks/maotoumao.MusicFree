export default function <T = any>(raw?: string) {
    try {
        if (!raw) {
            return null;
        }
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}
