import { AboutUs, HeroSection, WhyChooseUsSection } from "./_sections";

export default function Home() {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <AboutUs />
            <WhyChooseUsSection />
        </div>
    )
}