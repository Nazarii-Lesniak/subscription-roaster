import { NotFoundContent } from "@/components/not-found-content";
import { ThemeProvider } from "@/components/theme-provider";
import { TranslationProvider } from "@/components/translation-provider";

export default function NotFound() {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <NotFoundContent />
      </TranslationProvider>
    </ThemeProvider>
  );
}
