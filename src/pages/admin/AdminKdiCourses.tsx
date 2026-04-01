import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Search, Plus, X, Save, Trash2, Edit, ChevronDown, ChevronRight, BookOpen } from 'lucide-react'

const LEVELS = ['beginner','intermediate','advanced','certification']
const defaultCourse = { title:'', slug:'', code:'', description:'', level:'beginner', category:'Discipleship', prerequisites:'', duration_hours:'', price:'0', is_required:false, is_active:true, is_published:false, sort_order:0 }
const defaultLesson = { title:'', content:'', video_url:'', document_url:'', duration_minutes:'', sort_order:0, is_published:false }

function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') }

export default function AdminKdiCourses() {
  const [courses, setCourses] = useState<any[]>([])
  const [lessons, setLessons] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string[]>([])
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [editingLesson, setEditingLesson] = useState<any>(null)
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null)
  const [courseForm, setCourseForm] = useState<any>(defaultCourse)
  const [lessonForm, setLessonForm] = useState<any>(defaultLesson)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('kdi_courses').select('*').order('sort_order')
    setCourses(data || [])
    setLoading(false)
  }
  const loadLessons = async (courseId: string) => {
    const { data } = await supabase.from('kdi_lessons').select('*').eq('course_id', courseId).order('sort_order')
    setLessons(prev => ({ ...prev, [courseId]: data || [] }))
  }
  const toggleExpand = (id: string) => {
    if (expanded.includes(id)) { setExpanded(prev => prev.filter(i => i !== id)) }
    else { setExpanded(prev => [...prev, id]); loadLessons(id) }
  }

  const filtered = courses.filter(c => search === '' || `${c.title} ${c.code||''}`.toLowerCase().includes(search.toLowerCase()))

  const openCreateCourse = () => { setEditingCourse(null); setCourseForm(defaultCourse); setError(''); setShowCourseModal(true) }
  const openEditCourse = (c: any) => { setEditingCourse(c); setCourseForm({ ...c, price: String(c.price), duration_hours: String(c.duration_hours||'') }); setError(''); setShowCourseModal(true) }
  const openCreateLesson = (courseId: string) => { setActiveCourseId(courseId); setEditingLesson(null); setLessonForm({ ...defaultLesson, sort_order: (lessons[courseId]||[]).length + 1 }); setError(''); setShowLessonModal(true) }
  const openEditLesson = (lesson: any, courseId: string) => { setActiveCourseId(courseId); setEditingLesson(lesson); setLessonForm({ ...lesson, duration_minutes: String(lesson.duration_minutes||'') }); setError(''); setShowLessonModal(true) }

  const saveCourse = async () => {
    setSaving(true); setError('')
    if (!courseForm.title) { setError('Title required'); setSaving(false); return }
    const payload = { ...courseForm, slug: courseForm.slug || slugify(courseForm.title), price: parseFloat(courseForm.price)||0, duration_hours: parseInt(courseForm.duration_hours)||null }
    if (editingCourse) { await supabase.from('kdi_courses').update(payload).eq('id', editingCourse.id) }
    else { await supabase.from('kdi_courses').insert(payload) }
    setSaving(false); setShowCourseModal(false); load()
  }
  const saveLesson = async () => {
    setSaving(true); setError('')
    if (!lessonForm.title) { setError('Title required'); setSaving(false); return }
    const payload = { ...lessonForm, course_id: activeCourseId, duration_minutes: parseInt(lessonForm.duration_minutes)||null }
    if (editingLesson) { await supabase.from('kdi_lessons').update(payload).eq('id', editingLesson.id) }
    else { await supabase.from('kdi_lessons').insert(payload) }
    setSaving(false); setShowLessonModal(false); if (activeCourseId) loadLessons(activeCourseId)
  }
  const deleteCourse = async (id: string) => { if (!confirm('Delete this course?')) return; await supabase.from('kdi_courses').delete().eq('id', id); load() }
  const deleteLesson = async (id: string, courseId: string) => { if (!confirm('Delete lesson?')) return; await supabase.from('kdi_lessons').delete().eq('id', id); loadLessons(courseId) }
  const cf = (k: string, v: any) => setCourseForm((p: any) => ({ ...p, [k]: v }))
  const lf = (k: string, v: any) => setLessonForm((p: any) => ({ ...p, [k]: v }))

  return (
    <AdminLayout title="Kingdom Dominion Institute" subtitle="Courses, lessons, and enrollment management">
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input className="input pl-9" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <button className="btn-primary flex items-center gap-2" onClick={openCreateCourse}><Plus size={16} /> Add Course</button>
      </div>

      {loading ? <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" /></div>
      : filtered.length === 0 ? (
        <div className="card p-12 text-center"><BookOpen size={32} className="text-gray-200 mx-auto mb-3" /><p className="text-gray-400 font-body">No courses found.</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(course => (
            <div key={course.id} className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleExpand(course.id)}>
                <div className="flex items-center gap-3">
                  {expanded.includes(course.id) ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-crimson-900">{course.title}</span>
                      {course.code && <span className="text-xs text-gray-400 font-body">{course.code}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 font-body capitalize">{course.level}</span>
                      {course.duration_hours && <span className="text-xs text-gray-400 font-body">· {course.duration_hours}h</span>}
                      {course.price > 0 && <span className="text-xs text-crimson-600 font-body font-semibold">· ${course.price}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <span className={`badge text-xs ${course.is_published ? 'badge-green' : 'badge-gray'}`}>{course.is_published ? 'Published' : 'Draft'}</span>
                  <button onClick={() => openEditCourse(course)} className="p-1.5 text-gray-400 hover:text-crimson-700 hover:bg-crimson-50 rounded"><Edit size={14} /></button>
                  <button onClick={() => deleteCourse(course.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                </div>
              </div>

              {expanded.includes(course.id) && (
                <div className="border-t border-gray-100 px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-600 font-body">Lessons ({(lessons[course.id]||[]).length})</span>
                    <button onClick={() => openCreateLesson(course.id)} className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1"><Plus size={12} /> Add Lesson</button>
                  </div>
                  {(lessons[course.id]||[]).length === 0 ? (
                    <p className="text-sm text-gray-400 font-body">No lessons yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {(lessons[course.id]||[]).map((lesson, i) => (
                        <div key={lesson.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-body w-5">{i+1}.</span>
                            <span className="text-sm font-body text-gray-800">{lesson.title}</span>
                            {lesson.duration_minutes && <span className="text-xs text-gray-400 font-body">{lesson.duration_minutes}m</span>}
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => openEditLesson(lesson, course.id)} className="p-1 text-gray-400 hover:text-crimson-700 rounded"><Edit size={13} /></button>
                            <button onClick={() => deleteLesson(lesson.id, course.id)} className="p-1 text-gray-400 hover:text-red-600 rounded"><Trash2 size={13} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b"><h2 className="font-display text-lg font-semibold text-crimson-900">{editingCourse ? 'Edit Course' : 'Add Course'}</h2><button onClick={() => setShowCourseModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button></div>
            <div className="p-6 space-y-4">
              <div><label className="label">Course Title *</label><input className="input" value={courseForm.title} onChange={e => cf('title', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Course Code</label><input className="input" value={courseForm.code} onChange={e => cf('code', e.target.value)} placeholder="KDI-101" /></div>
                <div><label className="label">Level</label><select className="input" value={courseForm.level} onChange={e => cf('level', e.target.value)}>{LEVELS.map(l => <option key={l} value={l} className="capitalize">{l}</option>)}</select></div>
              </div>
              <div><label className="label">Description</label><textarea className="input" rows={3} value={courseForm.description} onChange={e => cf('description', e.target.value)} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="label">Duration (hours)</label><input type="number" className="input" value={courseForm.duration_hours} onChange={e => cf('duration_hours', e.target.value)} /></div>
                <div><label className="label">Price ($)</label><input type="number" step="0.01" className="input" value={courseForm.price} onChange={e => cf('price', e.target.value)} /></div>
                <div><label className="label">Sort Order</label><input type="number" className="input" value={courseForm.sort_order} onChange={e => cf('sort_order', parseInt(e.target.value)||0)} /></div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={courseForm.is_published} onChange={e => cf('is_published', e.target.checked)} className="accent-crimson-700" /><span className="text-sm font-body text-gray-700">Published</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={courseForm.is_required} onChange={e => cf('is_required', e.target.checked)} className="accent-crimson-700" /><span className="text-sm font-body text-gray-700">Required</span></label>
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowCourseModal(false)} className="btn-ghost text-gray-600 border border-gray-300">Cancel</button>
              <button onClick={saveCourse} className="btn-primary flex items-center gap-2" disabled={saving}>{saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}{editingCourse ? 'Save Changes' : 'Add Course'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b"><h2 className="font-display text-lg font-semibold text-crimson-900">{editingLesson ? 'Edit Lesson' : 'Add Lesson'}</h2><button onClick={() => setShowLessonModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button></div>
            <div className="p-6 space-y-4">
              <div><label className="label">Lesson Title *</label><input className="input" value={lessonForm.title} onChange={e => lf('title', e.target.value)} /></div>
              <div><label className="label">Content</label><textarea className="input" rows={4} value={lessonForm.content} onChange={e => lf('content', e.target.value)} placeholder="Lesson content, notes, or outline..." /></div>
              <div><label className="label">Video URL</label><input className="input" value={lessonForm.video_url} onChange={e => lf('video_url', e.target.value)} placeholder="https://youtube.com/..." /></div>
              <div><label className="label">Document URL</label><input className="input" value={lessonForm.document_url} onChange={e => lf('document_url', e.target.value)} placeholder="https://..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Duration (minutes)</label><input type="number" className="input" value={lessonForm.duration_minutes} onChange={e => lf('duration_minutes', e.target.value)} /></div>
                <div><label className="label">Sort Order</label><input type="number" className="input" value={lessonForm.sort_order} onChange={e => lf('sort_order', parseInt(e.target.value)||0)} /></div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={lessonForm.is_published} onChange={e => lf('is_published', e.target.checked)} className="accent-crimson-700" /><span className="text-sm font-body">Published</span></label>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowLessonModal(false)} className="btn-ghost text-gray-600 border border-gray-300">Cancel</button>
              <button onClick={saveLesson} className="btn-primary flex items-center gap-2" disabled={saving}>{saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}{editingLesson ? 'Save' : 'Add Lesson'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
