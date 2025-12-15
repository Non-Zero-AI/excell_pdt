import { useParams } from 'react-router-dom'
import { useCourse } from '../../hooks/useCourseData'
import CourseDetailContent from '../../components/CourseDetail'

const CourseDetail = () => {
  const { id } = useParams()
  const { course, loading, error } = useCourse(id)

  return <CourseDetailContent course={course} loading={loading} error={error} />
}

export default CourseDetail

