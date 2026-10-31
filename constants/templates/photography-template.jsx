import React from 'react';

export default function Template2({ content }) {
  return (
    <div>
      <h1>{content.title}</h1>
      <p>{content.description}</p>
      {content.content.map((item, index) => {
        if (item.type === 'text') {
          return <p key={index}>{item.text}</p>;
        } else if (item.type === 'image') {
          return <img key={index} src={item.src} alt={item.alt} />;
        }
      })}
    </div>
  );
}
