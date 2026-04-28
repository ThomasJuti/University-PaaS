-- Create tables
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Insert sample students
INSERT INTO students (name, email) VALUES
    ('Alice Johnson', 'alice@university.edu'),
    ('Bob Smith', 'bob@university.edu')
ON CONFLICT (email) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (name, description) VALUES
    ('Introduction to Computer Science', 'Fundamentals of programming and computer systems'),
    ('Database Systems', 'Modern database design and SQL')
ON CONFLICT DO NOTHING;