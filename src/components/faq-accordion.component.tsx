"use client";

import { FC, ReactNode, useState } from "react";

import { ChevronDown } from "lucide-react";
import {
    Accordion as MTAccordion,
    AccordionBody as MTAccordionBody,
    AccordionBodyProps,
    AccordionHeader as MTAccordionHeader,
    AccordionHeaderProps,
    AccordionProps,
} from "@material-tailwind/react";

const Accordion = MTAccordion as unknown as FC<Partial<AccordionProps>>;
const AccordionHeader = MTAccordionHeader as unknown as FC<Partial<AccordionHeaderProps>>;
const AccordionBody = MTAccordionBody as unknown as FC<Partial<AccordionBodyProps>>;

import cn from "@/lib/tw-merge";

import TextCustom from "@/components/text-custom.component";

import FadeIn from "@/app/component/fade-in.components";
import {
    CARD_SIZE_CLASSNAME,
    CARD_VARIANT_CLASSNAME,
} from "@/shared/ui/classes/card.classes";

export interface FaqAccordionItem {
    label: string;
    description: ReactNode;
}

interface FaqAccordionProps {
    items?: FaqAccordionItem[];
    /** When false (default), only one panel can be open at a time. */
    multiple?: boolean;
    /** Panel indexes open on first render. */
    defaultOpenIndexes?: number[];
}

const FaqAccordion = ({
    items,
    multiple = true,
    defaultOpenIndexes = [],
}: FaqAccordionProps) => {
    const [openIndexes, setOpenIndexes] = useState<Set<number>>(
        () => new Set(defaultOpenIndexes),
    );

    const toggleItem = (index: number) => {
        setOpenIndexes((prev) => {
            if (multiple) {
                const next = new Set(prev);
                if (next.has(index)) next.delete(index);
                else next.add(index);
                return next;
            }

            return prev.has(index) ? new Set() : new Set([index]);
        });
    };

    const renderAccordionItem = (item: FaqAccordionItem, index: number) => {
        const isOpen = openIndexes.has(index);

        return (
            <FadeIn key={index} delay={index * 100} className="w-full self-start">
                <Accordion
                    open={isOpen}
                    onClick={() => toggleItem(index)}
                    className={cn(
                        CARD_SIZE_CLASSNAME["3"],
                        CARD_VARIANT_CLASSNAME.surface,
                    )}
                    icon={(
                        <ChevronDown
                            className={cn(
                                "size-4 shrink-0 text-(--text-secondary) transition-transform duration-200",
                                !isOpen && "-rotate-90",
                            )}
                            aria-hidden
                        />
                    )}
                >
                    <AccordionHeader className="border-none p-0">
                        <TextCustom
                            label={item.label}
                            size="3"
                            weight="medium"
                            color="default"
                            align="start"
                            className="w-full"
                        />
                    </AccordionHeader>
                    <AccordionBody
                        className="flex flex-col gap-3 p-0 pt-3 lg:gap-4"
                    >
                        <TextCustom
                            label={item.description}
                            size="2"
                            weight="regular"
                            color="secondary"
                            align="start"
                        />
                    </AccordionBody>
                </Accordion>
            </FadeIn>
        );
    };

    const leftItems = items?.filter((_, index) => index % 2 === 0) ?? [];
    const rightItems = items?.filter((_, index) => index % 2 !== 0) ?? [];

    return (
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-start">
            <div className="flex flex-1 flex-col gap-4">
                {leftItems.map((item, columnIndex) => renderAccordionItem(item, columnIndex * 2))}
            </div>
            <div className="flex flex-1 flex-col gap-4">
                {rightItems.map((item, columnIndex) => renderAccordionItem(item, columnIndex * 2 + 1))}
            </div>
        </div>
    );
};

export default FaqAccordion;
