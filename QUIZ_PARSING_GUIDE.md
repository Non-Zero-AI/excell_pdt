# 📝 Quiz Parsing Guide

This guide explains how to parse quizzes and knowledge checks from Word documents and integrate them into the Excell PDT course system.

## Overview

The quiz system is designed to be flexible:
- **Chapters with quizzes**: Display interactive quiz components
- **Chapters without quizzes**: Display content normally
- **Mixed content**: Chapters can have both content and quizzes

## Quiz Data Structure

### Chapter Structure

```javascript
{
  id: 'chapter-1',
  title: 'Module 1: Introduction',
  duration: 45,
  content: 'Chapter content here...', // Markdown or HTML
  quiz: { // Optional - only if chapter has quiz
    id: 'quiz-1',
    title: 'Knowledge Check: Module 1',
    description: 'Test your understanding...',
    passingScore: 70, // Percentage required to pass
    questions: [
      // Question objects (see below)
    ]
  }
}
```

### Question Structure

```javascript
{
  id: 'q1', // Unique question ID
  question: 'What is the recommended following distance?',
  answers: [
    { id: 'a1', text: '2 seconds' },
    { id: 'a2', text: '4 seconds' },
    { id: 'a3', text: '6 seconds' },
    { id: 'a4', text: '8 seconds' }
  ],
  correctAnswer: 'a3', // ID of correct answer
  explanation: 'Commercial vehicles require 6 seconds...' // Optional
}
```

## Parsing Word Documents

### Step 1: Identify Quiz Sections

Look for these patterns in Word documents:
- Files with "Quiz" or "Knowledge Check" in the filename
- Sections with question numbers (1., 2., 3., etc.)
- Multiple choice options (A, B, C, D or a, b, c, d)
- Answer keys or correct answers indicated

### Step 2: Extract Questions

Parse questions using these patterns:

#### Pattern 1: Numbered Questions
```
1. What is the recommended following distance?
   A. 2 seconds
   B. 4 seconds
   C. 6 seconds
   D. 8 seconds
   Answer: C
```

#### Pattern 2: Question with Options
```
Question: When should you check your mirrors?
Options:
- Every 5-8 seconds
- Every 30 seconds
- Only when changing lanes
- Once per minute
Correct Answer: Every 5-8 seconds
```

### Step 3: Convert to JSON

Example parser function (pseudo-code):

```javascript
function parseQuizFromWord(content) {
  const questions = []
  
  // Split by question markers
  const questionBlocks = content.split(/\d+\./).filter(Boolean)
  
  questionBlocks.forEach((block, index) => {
    const lines = block.trim().split('\n')
    const questionText = lines[0].trim()
    
    // Extract answers (lines starting with A., B., C., D. or -, *)
    const answerLines = lines.filter(line => 
      /^[A-D]\.|^[-*]/.test(line.trim())
    )
    
    const answers = answerLines.map((line, ansIndex) => ({
      id: `a${index}-${ansIndex + 1}`,
      text: line.replace(/^[A-D]\.\s*|^[-*]\s*/, '').trim()
    }))
    
    // Find correct answer (look for "Answer:", "Correct:", etc.)
    const answerLine = lines.find(line => 
      /Answer:|Correct:/i.test(line)
    )
    const correctText = answerLine?.split(':')[1]?.trim()
    const correctAnswer = answers.find(a => 
      a.text.includes(correctText) || correctText === a.text
    )
    
    questions.push({
      id: `q${index + 1}`,
      question: questionText,
      answers,
      correctAnswer: correctAnswer?.id || answers[0]?.id,
      explanation: null // Extract if available
    })
  })
  
  return {
    id: `quiz-${Date.now()}`,
    title: 'Knowledge Check',
    description: 'Test your understanding of the material',
    passingScore: 70,
    questions
  }
}
```

## Integration Steps

### 1. Parse Document

```javascript
// Example: Using mammoth.js to convert Word to HTML
import mammoth from 'mammoth'

async function parseWordDocument(file) {
  const result = await mammoth.convertToHtml({ arrayBuffer: file })
  const html = result.value
  
  // Extract quiz section
  const quizSection = extractQuizSection(html)
  
  // Parse quiz
  const quiz = parseQuizFromWord(quizSection)
  
  return quiz
}
```

### 2. Add to Chapter

```javascript
const chapter = {
  id: 'chapter-1',
  title: 'Module 1: Introduction',
  content: chapterContent, // Regular content
  quiz: parsedQuiz // Add quiz if found
}
```

### 3. Store in Database

When storing in Supabase:

```javascript
// Store quiz separately
const { data: quiz } = await supabase
  .from('quizzes')
  .insert({
    chapter_id: chapterId,
    course_id: courseId,
    title: quiz.title,
    description: quiz.description,
    questions: quiz.questions, // Stored as JSONB
    passing_score: quiz.passingScore
  })
  .select()
  .single()

// Link quiz to chapter
await supabase
  .from('chapters')
  .update({ quiz_id: quiz.id })
  .eq('id', chapterId)
```

## Example: Complete Parsing Workflow

```javascript
import { parseQuizFromWord } from './parsers/wordParser'
import { normalizeQuiz } from '../utils/quizHelpers'

async function processCourseModule(wordFile, chapterData) {
  // 1. Convert Word to text/HTML
  const content = await convertWordToText(wordFile)
  
  // 2. Check if file contains quiz
  const hasQuiz = /quiz|knowledge check|test/i.test(wordFile.name) ||
                  /^\d+\./.test(content) // Has numbered questions
  
  if (hasQuiz) {
    // 3. Parse quiz
    const rawQuiz = parseQuizFromWord(content)
    
    // 4. Normalize quiz structure
    const quiz = normalizeQuiz(rawQuiz)
    
    // 5. Extract non-quiz content (if any)
    const chapterContent = extractChapterContent(content, quiz)
    
    return {
      ...chapterData,
      content: chapterContent,
      quiz: quiz
    }
  } else {
    // Regular chapter without quiz
    return {
      ...chapterData,
      content: content
    }
  }
}
```

## Best Practices

1. **Question IDs**: Use consistent ID format (`q1`, `q2`, etc.)
2. **Answer IDs**: Use format like `a1-1`, `a1-2` (question-answer)
3. **Normalization**: Always use `normalizeQuiz()` helper before storing
4. **Validation**: Validate quiz structure before saving
5. **Error Handling**: Handle missing answers, malformed questions gracefully

## Validation Checklist

Before adding a quiz to the system, verify:

- [ ] All questions have unique IDs
- [ ] All questions have at least 2 answer options
- [ ] Each question has exactly one correct answer
- [ ] Correct answer ID matches an answer option ID
- [ ] Passing score is between 0-100
- [ ] Quiz title and description are provided
- [ ] Question text is clear and complete

## Testing

Test quiz parsing with:

```javascript
import { normalizeQuiz } from '../utils/quizHelpers'

const rawQuiz = {
  // Your parsed quiz data
}

const normalized = normalizeQuiz(rawQuiz)

// Verify structure
console.assert(normalized.questions.length > 0, 'Quiz has questions')
console.assert(
  normalized.questions.every(q => q.correctAnswer),
  'All questions have correct answers'
)
```

## Tools & Libraries

Recommended libraries for Word document parsing:

- **mammoth.js**: Convert .docx to HTML
- **docx**: Parse and manipulate Word documents
- **officegen**: Generate Word documents
- **cheerio**: Parse HTML (if converting to HTML first)

## Next Steps

1. Create a Word document parser service
2. Build a batch processing script for all course modules
3. Add validation and error reporting
4. Create admin interface for quiz management
5. Add support for different question types (true/false, multiple choice, etc.)

---

**Note**: The quiz system is designed to work with or without quizzes. Chapters without quizzes will display normally, and the quiz components only appear when a quiz is present.

