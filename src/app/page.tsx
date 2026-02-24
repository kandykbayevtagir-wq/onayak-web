"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function Home() {
  const [status, setStatus] = useState("Проверка связи...");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    async function testConnection() {
      try {
        // Пробуем просто прочитать количество строк
        const { data, error, count } = await supabase
          .from('podology_centers')
          .select('*', { count: 'exact' });

        if (error) {
          setStatus("ОШИБКА SUPABASE ❌");
          setDebugInfo(`Код: ${error.code} | Сообщение: ${error.message}`);
        } else {
          setStatus("СВЯЗЬ ЕСТЬ ✅");
          setDebugInfo(`Найдено записей в базе: ${data?.length || 0}. Если тут 0, значит Актобе не найден.`);
        }
      } catch (err: any) {
        setStatus("ОШИБКА СЕТИ/КЛЮЧЕЙ ⚠️");
        setDebugInfo(err.message || "Неизвестная ошибка");
      }
    }
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10 font-mono text-xs">
      <h1 className="text-xl font-bold mb-4">{status}</h1>
      <div className="bg-gray-900 p-4 rounded border border-gray-800 break-all">
        <p className="text-blue-400 mb-2">Детали:</p>
        {debugInfo}
      </div>
      <p className="mt-10 text-gray-500 italic">Сделай скриншот этого экрана, если не заработает.</p>
    </div>
  );
}