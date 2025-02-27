"use client";
import { usePathname } from "next/navigation";

export default function SwitchThemeButton() {
    const pathname = usePathname();
    const handleSwitchTheme = () => {
        // Get current theme from cookie or system preference
        const currentTheme = document.cookie.split('; ').find(row => row.startsWith('theme='))?.split('=')[1] ||
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        // Toggle to opposite theme
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Set cookie
        document.cookie = `theme=${newTheme}; path=/; max-age=31536000`; // 1 year expiry

        // Toggle Tailwind theme
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    };
    if (pathname === "/") {
        return null;
    }
    return (
        <button
            onClick={handleSwitchTheme}
            className="text-amber-300 z-50"
        >
            <div className="fixed bottom-5 right-5 p-3 bg-background-light dark:bg-background-dark rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 dark:hidden" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_iconCarrier">
                        <path d="M17.5 17.5L19 19M20 12H22M6.5 6.5L5 5M17.5 6.5L19 5M6.5 17.5L5 19M2 12H4M12 2V4M12 20V22M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="#FCD440" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </g>
                </svg>
                <svg className="w-6 h-6 hidden dark:block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.5287 15.9294C21.3687 15.6594 20.9187 15.2394 19.7987 15.4394C19.1787 15.5494 18.5487 15.5994 17.9187 15.5694C15.5887 15.4694 13.4787 14.3994 12.0087 12.7494C10.7087 11.2994 9.90873 9.40938 9.89873 7.38938C9.89873 6.23938 10.1187 5.13938 10.5687 4.08938C11.0087 3.07938 10.6987 2.54938 10.4787 2.32938C10.2487 2.09938 9.70873 1.77938 8.64873 2.21938C4.55873 3.93938 2.02873 8.03938 2.32873 12.4294C2.62873 16.5594 5.52873 20.0894 9.36873 21.4194C10.2887 21.7394 11.2587 21.9294 12.2587 21.9694C12.4187 21.9794 12.5787 21.9894 12.7387 21.9894C16.0887 21.9894 19.2287 20.4094 21.2087 17.7194C21.8787 16.7894 21.6987 16.1994 21.5287 15.9294Z" fill="#FCD440" />
                </svg>
            </div>
        </button>
    )
}