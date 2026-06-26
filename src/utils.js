/**
 * Calculates the percentile score of a student's marks compared to all students.
 * JEE Mains Style Formula:
 * Percentile = (Number of students with marks <= studentMarks) / (Total number of students) * 100
 */
export function calculatePercentile(studentMarks, allStudents) {
  if (allStudents.length === 0) return 0;
  
  const count = allStudents.filter(s => s.marks <= studentMarks).length;
  const percentile = (count / allStudents.length) * 100;
  
  // Format to 4 decimal places (JEE Mains typical format)
  return Math.round(percentile * 10000) / 10000;
}
