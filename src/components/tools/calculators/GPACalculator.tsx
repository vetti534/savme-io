'use client';

import { useState, useEffect } from 'react';
import styles from './AverageCalculator.module.css'; // Reusing generic styles
import ToolResult from '@/components/tools/ToolResult';

interface Course {
    id: number;
    grade: number; // Point value
    credits: number;
}

export default function GPACalculator() {
    const [courses, setCourses] = useState<Course[]>([
        { id: 1, grade: 4, credits: 3 },
        { id: 2, grade: 3.5, credits: 3 },
        { id: 3, grade: 4, credits: 1 },
    ]);

    const [gpa, setGpa] = useState<number>(0);
    const [totalCredits, setTotalCredits] = useState<number>(0);

    const addCourse = () => {
        setCourses([...courses, { id: Date.now(), grade: 4, credits: 3 }]);
    };

    const removeCourse = (id: number) => {
        setCourses(courses.filter(c => c.id !== id));
    };

    const updateCourse = (id: number, field: keyof Course, val: number) => {
        setCourses(courses.map(c => c.id === id ? { ...c, [field]: val } : c));
    };

    useEffect(() => {
        let points = 0;
        let creds = 0;
        courses.forEach(c => {
            points += c.grade * c.credits;
            creds += c.credits;
        });

        setTotalCredits(creds);
        if (creds > 0) {
            setGpa(parseFloat((points / creds).toFixed(2)));
        } else {
            setGpa(0);
        }
    }, [courses]);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.inputs}>
                    <label>Courses</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {courses.map((c, index) => (
                            <div key={c.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{ width: '20px', color: '#999' }}>{index + 1}.</span>
                                <div style={{ flex: 1 }}>
                                    <select
                                        value={c.grade}
                                        onChange={(e) => updateCourse(c.id, 'grade', Number(e.target.value))}
                                        className={styles.select}
                                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    >
                                        <option value={4}>A (4.0)</option>
                                        <option value={3.7}>A- (3.7)</option>
                                        <option value={3.3}>B+ (3.3)</option>
                                        <option value={3}>B (3.0)</option>
                                        <option value={2.7}>B- (2.7)</option>
                                        <option value={2.3}>C+ (2.3)</option>
                                        <option value={2}>C (2.0)</option>
                                        <option value={1.7}>C- (1.7)</option>
                                        <option value={1}>D (1.0)</option>
                                        <option value={0}>F (0.0)</option>
                                    </select>
                                </div>
                                <div style={{ width: '80px' }}>
                                    <input
                                        type="number"
                                        value={c.credits}
                                        onChange={(e) => updateCourse(c.id, 'credits', Number(e.target.value))}
                                        placeholder="Cr"
                                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                                <button onClick={() => removeCourse(c.id)} style={{ color: 'red' }}>×</button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={addCourse}
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#f3f4f6', borderRadius: '0.5rem', width: '100%' }}
                    >
                        + Add Course
                    </button>
                </div>

                <div className={styles.results}>
                    <ToolResult
                        title={`${gpa}`}
                        subTitle="GPA"
                        toolName="GPA Calculator"
                        extraStats={[
                            { label: 'Total Credits', value: `${totalCredits}` },
                            { label: 'Courses', value: `${courses.length}` },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
