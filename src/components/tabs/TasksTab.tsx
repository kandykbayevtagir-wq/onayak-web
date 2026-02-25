"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Trash2, Plus, Users, Zap } from "lucide-react";

import { supabase } from "../../app/supabase"; 
import { DIRECTOR_ID, TASK_TEMPLATES } from "../../config/constants";

export default function TasksTab({ theme, triggerHaptic, tgUser }: any) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");
  const [assignee, setAssignee] = useState("Администратор");
  const [isLoading, setIsLoading] = useState(false);

  const isDirector = tgUser?.id === DIRECTOR_ID;

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (data) setTasks(data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleAddTask = async (e?: any) => {
    if (e) e.preventDefault();
    if (!newTask) return;
    triggerHaptic('medium');
    setIsLoading(true);
    const { error } = await supabase.from('tasks').insert([
      { task_text: newTask, assignee: assignee, created_by: tgUser?.id, status: 'pending' }
    ]);
    if (!error) {
      setNewTask("");
      fetchTasks();
    }
    setIsLoading(false);
  };

  const toggleTaskStatus = async (id: number, currentStatus: string) => {
    triggerHaptic('success');
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    triggerHaptic('heavy');
    if (!confirm("Удалить задачу?")) return;
    await supabase.from('tasks').delete().eq('id', id);
    fetchTasks();
  };

  return (
    <div className="p-5 flex-1 flex flex-col pb-10">
      <div className="flex items-center gap-2 mb-6">
        <Users className="text-purple-500" size={28}/>
        <h2 className="text-2xl font-black">Команда</h2>
      </div>

      {/* ФОРМА ВИДНА ТОЛЬКО ДИРЕКТОРУ */}
      {isDirector && (
        <div className="mb-6 space-y-4">
          <form onSubmit={handleAddTask} className={`p-5 rounded-3xl border flex flex-col gap-4 shadow-sm ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
            <div>
              <label className="block text-[10px] font-bold uppercase opacity-50 mb-2 ml-1">Исполнитель:</label>
              <div className="flex gap-2">
                {["Администратор", "Специалист"].map((role: string) => (
                  <button type="button" key={role} onClick={() => { triggerHaptic('light'); setAssignee(role); }} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${assignee === role ? "bg-purple-600 border-purple-600 text-white" : "opacity-40"}`}>
                    {role}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase opacity-50 mb-2 ml-1">Быстрые шаблоны:</label>
              <div className="flex flex-wrap gap-2">
                {TASK_TEMPLATES.map((tmpl) => (
                  <button key={tmpl} type="button" onClick={() => { triggerHaptic('light'); setNewTask(tmpl); }} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} active:scale-95`}>
                    + {tmpl}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-2">
              <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Или введите текст..." className={`w-full border rounded-xl px-4 py-4 text-sm outline-none font-medium ${theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`} />
            </div>
            
            <button type="submit" disabled={isLoading || !newTask} className="w-full py-4 bg-purple-600 text-white text-sm font-black rounded-xl active:scale-95 transition-transform flex justify-center items-center gap-2 shadow-lg shadow-purple-500/20">
              <Plus size={18}/> ПОСТАВИТЬ ЗАДАЧУ
            </button>
          </form>
        </div>
      )}

      {/* СПИСОК ЗАДАЧ (Виден всем) */}
      <div className="flex flex-col gap-3">
        {tasks.map((task: any) => {
          const isDone = task.status === 'completed';
          return (
            <div key={task.id} className={`p-4 rounded-2xl border flex justify-between items-center transition-all ${isDone ? 'opacity-50' : ''} ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center gap-3 flex-1" onClick={() => toggleTaskStatus(task.id, task.status)}>
                <button className={`p-1 rounded-full transition-colors ${isDone ? 'text-green-500' : 'text-gray-400'}`}>
                  {isDone ? <CheckCircle2 size={26}/> : <Circle size={26}/>}
                </button>
                <div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${task.assignee === 'Администратор' ? 'bg-blue-500/20 text-blue-500' : 'bg-orange-500/20 text-orange-500'}`}>{task.assignee}</span>
                  <p className={`text-sm font-bold mt-1 leading-tight ${isDone ? 'line-through opacity-50' : ''}`}>{task.task_text}</p>
                </div>
              </div>
              {/* Удалять может только директор */}
              {isDirector && (
                <button onClick={() => deleteTask(task.id)} className="p-2 text-red-500/30 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
              )}
            </div>
          )
        })}
        {tasks.length === 0 && <p className="text-center text-sm opacity-40 mt-10 font-bold">Задач пока нет ✨</p>}
      </div>
    </div>
  );
}