// js/ai.js
export function getCareerSuggestion(career) {
  const suggestions = {
    doctor: "Take biology and chemistry courses, volunteer at hospitals, and join medical clubs.",
    engineer: "Focus on math and physics, explore coding bootcamps, and build projects.",
    teacher: "Pursue education courses, gain teaching experience, and join mentorship programs."
  };
  return suggestions[career.toLowerCase()] || "Explore relevant courses and internships for your career!";
}
