import { format } from 'date-fns';
export const useDateUtils = () => {
    function formatDate(timestamp: string): string {
        const date = new Date(timestamp);
        return format(date, 'MMMM dd, yyyy HH:mm:ss');
    }
    return { 
        formatDate, 
    };
}