const { getDriver } = require('../utils/neo4jConnection');

class BookService {
  async getAllBooks() {
    const driver = await getDriver();
    const session = driver.session();
    
    try {
      const result = await session.run(`
        MATCH (b:Book)-[:BELONGS_TO]->(s:Subject)
        OPTIONAL MATCH (b)<-[:BELONGS_TO]-(c:Chapter)
        WITH b, s, COUNT(DISTINCT c) as chapterCount
        RETURN b {
          .id,
          .title,
          .isbn,
          .publisher,
          .publishYear,
          .description,
          .gradeLevel,
          .coverImageUrl,
          subject: s.name,
          subjectId: s.id,
          totalChapters: chapterCount
        } as book
        ORDER BY b.title
      `);
      
      return result.records.map(record => {
        const book = record.get('book');
        return {
          id: book.id,
          title: book.title,
          subject: book.subject,
          subjectId: book.subjectId,
          gradeLevel: book.gradeLevel || 'Not specified',
          description: book.description || '',
          isbn: book.isbn,
          publisher: book.publisher,
          publishYear: book.publishYear,
          coverImageUrl: book.coverImageUrl,
          totalChapters: book.totalChapters.toNumber(),
          estimatedHours: Math.round(book.totalChapters.toNumber() * 2.5), // Estimate 2.5 hours per chapter
          topics: [] // We can enhance this later
        };
      });
    } finally {
      await session.close();
    }
  }

  async getBookById(bookId) {
    const driver = await getDriver();
    const session = driver.session();
    
    try {
      const result = await session.run(`
        MATCH (b:Book {id: $bookId})-[:BELONGS_TO]->(s:Subject)
        OPTIONAL MATCH (b)<-[:BELONGS_TO]-(c:Chapter)
        OPTIONAL MATCH (c)<-[:BELONGS_TO]-(sec:Section)
        WITH b, s, 
             COUNT(DISTINCT c) as chapterCount,
             COLLECT(DISTINCT {
               id: c.id,
               title: c.title,
               chapterNumber: c.chapterNumber,
               sectionCount: COUNT(DISTINCT sec)
             }) as chapters
        RETURN b {
          .id,
          .title,
          .isbn,
          .publisher,
          .publishYear,
          .description,
          .gradeLevel,
          .coverImageUrl,
          subject: s.name,
          subjectId: s.id,
          totalChapters: chapterCount,
          chapters: chapters
        } as book
      `, { bookId });
      
      if (result.records.length === 0) {
        return null;
      }
      
      const book = result.records[0].get('book');
      return {
        id: book.id,
        title: book.title,
        subject: book.subject,
        subjectId: book.subjectId,
        gradeLevel: book.gradeLevel || 'Not specified',
        description: book.description || '',
        isbn: book.isbn,
        publisher: book.publisher,
        publishYear: book.publishYear,
        coverImageUrl: book.coverImageUrl,
        totalChapters: book.totalChapters.toNumber(),
        estimatedHours: Math.round(book.totalChapters.toNumber() * 2.5),
        chapters: book.chapters.sort((a, b) => a.chapterNumber - b.chapterNumber),
        topics: []
      };
    } finally {
      await session.close();
    }
  }

  async getBooksBySubject(subjectName) {
    const driver = await getDriver();
    const session = driver.session();
    
    try {
      const result = await session.run(`
        MATCH (s:Subject {name: $subjectName})<-[:BELONGS_TO]-(b:Book)
        OPTIONAL MATCH (b)<-[:BELONGS_TO]-(c:Chapter)
        WITH b, s, COUNT(DISTINCT c) as chapterCount
        RETURN b {
          .id,
          .title,
          .isbn,
          .publisher,
          .publishYear,
          .description,
          .gradeLevel,
          .coverImageUrl,
          subject: s.name,
          subjectId: s.id,
          totalChapters: chapterCount
        } as book
        ORDER BY b.gradeLevel, b.title
      `, { subjectName });
      
      return result.records.map(record => {
        const book = record.get('book');
        return {
          id: book.id,
          title: book.title,
          subject: book.subject,
          subjectId: book.subjectId,
          gradeLevel: book.gradeLevel || 'Not specified',
          description: book.description || '',
          isbn: book.isbn,
          publisher: book.publisher,
          publishYear: book.publishYear,
          coverImageUrl: book.coverImageUrl,
          totalChapters: book.totalChapters.toNumber(),
          estimatedHours: Math.round(book.totalChapters.toNumber() * 2.5),
          topics: []
        };
      });
    } finally {
      await session.close();
    }
  }
}

module.exports = new BookService();