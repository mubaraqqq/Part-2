import React from 'react';

const Header = ({ course }) => {
    return (
        <h1>{course}</h1>
    )
  };
  
  const Part = ({ parts }) => {
    return (
        <>
          {parts.map(part => (
            <p key={part.id}>{part.name} {part.exercises}</p>
            ))}
        </>
    )
  }
  
  // <Part parts={parts[0]}/>
  // <Part parts={parts[1]}/>
  // <Part parts={parts[2]}/>
  // <p>{parts.name} {parts.exercises}</p>
  const Content = ({ parts }) => {
    return (
        <Part parts={parts}/>
    )
  }
  
  const Total = ({ parts }) => {
    return (
        <p>total of {parts.map(part => part.exercises).reduce((acc, val) => acc + val)} exercises </p>
    )
  }
  
  const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total parts={course.parts}/>
        </div>
    )
  };

  export default Course;
