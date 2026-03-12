"use client"

import { useEffect, useState, useMemo } from "react"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/immersive/glass-card"
import { ButtonEnhanced } from "@/components/immersive/button-enhanced"
import { SkeletonLoader } from "@/components/immersive/skeleton-loader"
import { EmptyState } from "@/components/immersive/empty-state"
import { motion } from "framer-motion"
import {
  BookOpen, ArrowUpDown, Filter, Search, X,
  Calculator, Globe, Dna, Zap, Map, Ruler,
  Landmark, Flag, FlaskConical, BookText, Languages,
  Book, LayoutGrid, LayoutList, type LucideIcon
} from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { useNotification } from "@/contexts/notification-context"
import Link from "next/link"

interface Lesson {
  id: string
  title: string
  description?: string
  difficulty?: string
  completed?: boolean
  xp_reward?: number
  course_id?: string
}

type SortOption = "title" | "xp" | "recent"
type GradeFilter = "all" | string
type DifficultyFilter = "all" | string
type SubjectFilter = "all" | string

const SUBJECT_NAMES: Record<string, string> = {
  "alhebra-i-pochatky-analizu": "Algebra",
  "anhliyska-mova": "English",
  "biolohiya-i-ekolohiya": "Biology",
  "fizyka": "Physics",
  "heohrafiya": "Geography",
  "heometriya": "Geometry",
  "hromadyanska-osvita": "Civic Education",
  "istoriya-ukrayiny": "Ukrainian History",
  "khimiya": "Chemistry",
  "ukrayinska-literatura": "Ukrainian Literature",
  "ukrayinska-mova": "Ukrainian Language",
  "vsesvitnya-istoriya": "World History",
  "zarubizhna-literatura": "Foreign Literature",
  "algebra": "Algebra",
  "angliiska": "English",
  "biologiya": "Biology"
}

const SUBJECT_ICONS: Record<string, LucideIcon> = {
  "alhebra-i-pochatky-analizu": Calculator,
  "algebra": Calculator,
  "anhliyska-mova": Globe,
  "angliiska": Globe,
  "biolohiya-i-ekolohiya": Dna,
  "biologiya": Dna,
  "fizyka": Zap,
  "heohrafiya": Map,
  "heometriya": Ruler,
  "hromadyanska-osvita": Landmark,
  "istoriya-ukrayiny": Flag,
  "khimiya": FlaskConical,
  "ukrayinska-literatura": BookText,
  "ukrayinska-mova": Languages,
  "vsesvitnya-istoriya": Globe,
  "zarubizhna-literatura": Book
}

const LESSONS_PER_PAGE = 50

type ViewMode = "cards" | "list"

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>("title")
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all")
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [userGrade, setUserGrade] = useState<string | null>(null)
  const [isAutoFiltered, setIsAutoFiltered] = useState(false)
  const { error: showError } = useNotification()

  // Extract grade from course_id or lesson ID (e.g., "biolohiya-10" -> "10")
  const extractGrade = (lesson: Lesson): string | null => {
    const courseId = lesson.course_id || lesson.id
    const match = courseId.match(/(\d+)$|(\d+)-klas/i)
    return match ? (match[1] || match[2]) : null
  }

  // Extract subject from course_id (e.g., "biolohiya-i-ekolohiya-10" -> "biolohiya-i-ekolohiya")
  const extractSubject = (lesson: Lesson): string | null => {
    const courseId = lesson.course_id || ""
    const match = courseId.match(/^(.+)-(\d+)$/)
    return match ? match[1] : null
  }

  // Get subject display name
  const getSubjectName = (subjectKey: string): string => {
    return SUBJECT_NAMES[subjectKey] || subjectKey
  }

  // Get subject icon
  const getSubjectIcon = (lesson: Lesson): LucideIcon => {
    const subject = extractSubject(lesson)
    return subject ? (SUBJECT_ICONS[subject] || BookOpen) : BookOpen
  }

  // Get unique grades from lessons
  const availableGrades = useMemo(() => {
    const grades = new Set<string>()
    lessons.forEach(lesson => {
      const grade = extractGrade(lesson)
      if (grade && grade !== "5") grades.add(grade)  // Exclude grade 5
    })
    return Array.from(grades).sort((a, b) => parseInt(a) - parseInt(b))
  }, [lessons])

  // Get unique subjects from lessons
  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>()
    lessons.forEach(lesson => {
      const subject = extractSubject(lesson)
      if (subject) subjects.add(subject)
    })
    return Array.from(subjects).sort((a, b) =>
      getSubjectName(a).localeCompare(getSubjectName(b))
    )
  }, [lessons])

  // Get unique difficulties from lessons
  const availableDifficulties = useMemo(() => {
    const difficulties = new Set<string>()
    lessons.forEach(lesson => {
      if (lesson.difficulty) difficulties.add(lesson.difficulty)
    })
    return Array.from(difficulties)
  }, [lessons])

  // Filtered and sorted lessons
  const filteredAndSortedLessons = useMemo(() => {
    let filtered = [...lessons]

    // Auto-hide private videos
    filtered = filtered.filter(lesson =>
      !lesson.title?.toLowerCase().includes("[private video]") &&
      !lesson.title?.toLowerCase().includes("private video")
    )

    // Filter by grade
    if (gradeFilter !== "all") {
      filtered = filtered.filter(lesson => {
        const grade = extractGrade(lesson)
        return grade === gradeFilter
      })
    }

    // Filter by subject
    if (subjectFilter !== "all") {
      filtered = filtered.filter(lesson => {
        const subject = extractSubject(lesson)
        return subject === subjectFilter
      })
    }

    // Filter by difficulty
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(lesson => lesson.difficulty === difficultyFilter)
    }

    // Sort lessons
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "xp":
          return (b.xp_reward || 0) - (a.xp_reward || 0)
        case "recent":
          return 0 // Keep original order (most recent first from API)
        default:
          return 0
      }
    })

    return filtered
  }, [lessons, sortBy, gradeFilter, subjectFilter, difficultyFilter])

  // Paginated lessons
  const totalPages = Math.ceil(filteredAndSortedLessons.length / LESSONS_PER_PAGE)
  const paginatedLessons = useMemo(() => {
    const startIndex = (currentPage - 1) * LESSONS_PER_PAGE
    const endIndex = startIndex + LESSONS_PER_PAGE
    return filteredAndSortedLessons.slice(startIndex, endIndex)
  }, [filteredAndSortedLessons, currentPage])

  // Fetch user profile and auto-set grade filter
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await fetchWithAuth("/profiles/me")
        if (profile && profile.grade) {
          const gradeStr = profile.grade.toString()
          setUserGrade(gradeStr)
          // Auto-set grade filter to user's grade
          setGradeFilter(gradeStr)
          setIsAutoFiltered(true)
        }
      } catch (err) {
        // If profile fetch fails, continue with "all" filter
        console.log("Could not fetch user profile, using default filter")
      }
    }

    fetchUserProfile()
  }, [])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [gradeFilter, subjectFilter, difficultyFilter, sortBy, searchQuery])

  // Debounced search
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true)

        // Use search endpoint if there's a query
        const endpoint = searchQuery.trim()
          ? `/lessons/search?q=${encodeURIComponent(searchQuery.trim())}`
          : "/lessons"

        const data = await fetchWithAuth(endpoint)

        // Handle different response formats
        let lessonsData = []
        if (Array.isArray(data)) {
          lessonsData = data
        } else if (data && typeof data === "object") {
          // Try common response wrapper formats
          lessonsData = data.lessons || data.results || data.data || data.items || []
        }

        setLessons(lessonsData)
      } catch (err) {
        console.error("Error fetching lessons:", err)
        showError("Failed to load lessons")
        setLessons([])
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce search requests
    const timeoutId = setTimeout(() => {
      fetchLessons()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, showError])

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="w-8 h-8" />
            Lessons
          </h1>
          {isAutoFiltered && userGrade && gradeFilter === userGrade && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Showing Grade {userGrade} lessons
              </span>
              <button
                onClick={() => {
                  setGradeFilter("all")
                  setIsAutoFiltered(false)
                }}
                className="ml-2 text-xs px-2 py-1 rounded bg-background/50 hover:bg-background/80 transition-colors"
              >
                View All
              </button>
            </div>
          )}
        </div>

        {/* Search Bar and View Toggle */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search lessons by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-1 bg-background/50 border border-border rounded-lg p-1">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-2 rounded transition-colors ${
                viewMode === "cards"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="List view"
            >
              <LayoutList className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sorting and Filtering Controls */}
        {!isLoading && lessons.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-4">
            {/* Sort By */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="title">Sort by Title</option>
                <option value="xp">Sort by XP</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>

            {/* Subject Filter */}
            {availableSubjects.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Subjects</option>
                  {availableSubjects.map(subject => (
                    <option key={subject} value={subject}>{getSubjectName(subject)}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Grade Filter */}
            {availableGrades.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Grades</option>
                  {availableGrades.map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Difficulty Filter */}
            {availableDifficulties.length > 0 && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Difficulties</option>
                  {availableDifficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Results count */}
            <div className="flex items-center text-sm text-muted-foreground ml-auto">
              Showing {((currentPage - 1) * LESSONS_PER_PAGE) + 1}-{Math.min(currentPage * LESSONS_PER_PAGE, filteredAndSortedLessons.length)} of {filteredAndSortedLessons.length} lessons
            </div>
          </div>
        )}

        {isLoading ? (
          <SkeletonLoader type="card" count={4} />
        ) : lessons.length === 0 ? (
          <EmptyState
            icon={searchQuery ? "🔍" : "📚"}
            title={searchQuery ? "No lessons found" : "No lessons available"}
            description={searchQuery ? `No results for "${searchQuery}"` : "Check back soon for new learning content!"}
          />
        ) : filteredAndSortedLessons.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No lessons found"
            description="Try adjusting your filters"
          />
        ) : (
          <>
            {viewMode === "list" ? (
              /* List View */
              <div className="space-y-2">
                {paginatedLessons.map((lesson, index) => {
                  const SubjectIcon = getSubjectIcon(lesson)
                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={`/lessons/${lesson.id}`}>
                        <GlassCard className="group hover:border-foreground/30 transition-all duration-200">
                          <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                              <SubjectIcon className="w-6 h-6" />
                            </div>

                            {/* Title */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg group-hover:underline decoration-2 underline-offset-4 truncate text-foreground">
                                {lesson.title}
                              </h3>
                            </div>

                            {/* Badges - Right aligned */}
                            <div className="flex items-center gap-4 flex-shrink-0">
                              {lesson.difficulty && (
                                <span className="text-sm px-3 py-1.5 border-2 border-foreground/20 rounded font-bold">
                                  {lesson.difficulty}
                                </span>
                              )}
                              {lesson.xp_reward && (
                                <span className="text-sm font-bold tabular-nums text-foreground">
                                  +{lesson.xp_reward} XP
                                </span>
                              )}
                              <span className="text-foreground/60 group-hover:translate-x-1 transition-transform duration-200 font-bold text-xl">
                                →
                              </span>
                            </div>
                          </div>
                        </GlassCard>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              /* Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedLessons.map((lesson, index) => {
                  const SubjectIcon = getSubjectIcon(lesson)
                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={`/lessons/${lesson.id}`}>
                        <GlassCard className="group hover:border-foreground/30 transition-all duration-200 h-full">
                          <div className="flex flex-col h-full">
                            {/* Header with icon */}
                            <div className="flex items-start gap-3 mb-4">
                              <div className="flex-shrink-0 p-2 rounded-lg bg-foreground/5">
                                <SubjectIcon className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                {lesson.difficulty && (
                                  <span className="text-xs px-2 py-1 border border-foreground/20 rounded font-bold inline-block">
                                    {lesson.difficulty}
                                  </span>
                                )}
                                {lesson.xp_reward && (
                                  <div className="text-xs font-bold tabular-nums text-foreground">
                                    +{lesson.xp_reward} XP
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-base mb-3 line-clamp-2 group-hover:underline decoration-2 underline-offset-4 text-foreground flex-grow">
                              {lesson.title}
                            </h3>

                            {/* Arrow indicator */}
                            <div className="flex justify-end">
                              <span className="text-foreground/60 group-hover:translate-x-1 transition-transform duration-200 font-bold text-xl">
                                →
                              </span>
                            </div>
                          </div>
                        </GlassCard>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <ButtonEnhanced
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2"
                >
                  Previous
                </ButtonEnhanced>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === pageNum
                            ? "bg-primary text-primary-foreground"
                            : "bg-background/50 hover:bg-background/80"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <ButtonEnhanced
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2"
                >
                  Next
                </ButtonEnhanced>
              </div>
            )}
          </>
        )}
      </motion.div>
    </PageTransition>
  )
}
