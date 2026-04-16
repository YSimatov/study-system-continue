import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, BookOpen, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <div className="flex items-center justify-center">
          <Monitor className="h-6 w-6 mr-2" />
          <span className="font-bold">InfoSys Learn</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/auth/login">
            <Button variant="ghost">Войти</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Регистрация</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-stone-50 dark:bg-stone-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Компьютер и его ПО
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Информационная система обучения для 10 класса.
                  Изучайте теорию, проходите тесты и отслеживайте свой прогресс.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/auth/register">
                  <Button size="lg" className="px-8">Начать обучение</Button>
                </Link>
                <Link href="/topics">
                  <Button variant="outline" size="lg" className="px-8">Темы курса</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 mx-auto container px-4">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Теоретический материал</CardTitle>
              </CardHeader>
              <CardContent>
                Структурированные уроки по аппаратному и программному обеспечению.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Тесты для самоконтроля</CardTitle>
              </CardHeader>
              <CardContent>
                Проверяйте свои знания после каждой темы с мгновенным результатом.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Monitor className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Отслеживание прогресса</CardTitle>
              </CardHeader>
              <CardContent>
                Следите за своими успехами и возвращайтесь к сложным темам.
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
