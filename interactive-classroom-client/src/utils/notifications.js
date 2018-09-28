import { NotificationManager } from 'react-notifications';

const createNotification = (type, msg) => {
    return () => {
        switch (type) {
            case 'info':
                NotificationManager.info(msg);
                break;
            case 'success':
                NotificationManager.success(msg, 'Success');
                break;
            case 'warning':
                NotificationManager.warning(msg, 'Okay', 3000);
                break;
            case 'error':
                NotificationManager.error(msg, 'Okay!', 5000);
                break;
        }
    }
}

export default createNotification;