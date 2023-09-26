const express = require('express');
const server = express();
const fs = require('fs').promises;
const path = require('path');

server.use(express.json());

// Route : /
server.get('/', (req, res) => {
  res.status(404).send({ message: 'Success' });
});

//  Route : /api/course
server.get('/api/course', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'course.json');

    if (!filePath) {
      res.status(404).send({ error: 'File not found' });
      return;
    }

    const rawData = await fs.readFile(filePath, 'utf-8');
    const courses = JSON.parse(rawData);

    const courseId = req.query.id;

    if (courseId) {
      const course = courses.find(
        ({ course_id }) => course_id === Number(courseId)
      );
      if (!course) {
        res.status(404).send({ error: 'Course not found' });
        return;
      }
      res.status(200).send(course);
    } else {
      res.status(200).send(courses);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

server.listen(8000, () => console.log('Server Running 8000'));
