import { ToastOptions } from "react-hot-toast";
import Image from "next/image";

import templateToast from "./template.toast";

interface NotificationToastProps {
    image?: string;
    name: string;
    message: string;
    options?: ToastOptions;
}

const notificationToast = ({ image, name, message, options }: NotificationToastProps) => {
    return templateToast({
        options,
        render: () => (
            <div className="flex items-start gap-3 p-3 pr-7">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        width={36}
                        height={36}
                        className="shrink-0 h-9 w-9 rounded-full object-cover"
                    />
                ) : (
                    <div className="shrink-0 h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-(--text-primary) text-sm font-medium">
                        {name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex flex-col gap-1 flex-1">
                    <span className="text-sm font-medium text-(--text-primary)">{name}</span>
                    <span className="text-sm text-(--text-secondary)">{message}</span>
                </div>
            </div>
        ),
    });
};

export default notificationToast;
