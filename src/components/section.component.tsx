import { ReactNode } from "react";

interface SectionProps {
    title: ReactNode;
    description?: ReactNode;
    children: ReactNode;
    cols?: 1 | 2;
}

const Section = ({ title, description, children, cols = 2 }: SectionProps) => (
    <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
            <div className="flex flex-col gap-0.5">
                <h2 className="text-lg font-bold text-(--text-primary)">{title}</h2>
                {description && <p className="text-xs text-(--text-secondary)">{description}</p>}
            </div>
            <div className="flex-1 h-px bg-(--border-default)" />
        </div>
        <div className={cols === 1
            ? "flex flex-col gap-4"
            : "grid grid-cols-1 xl:grid-cols-2 gap-4"
        }>
            {children}
        </div>
    </section>
);

export default Section;