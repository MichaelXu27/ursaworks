import React from 'react';
import Paragraphs from './Paragraphs';
import '../styles/infoCardStyle.css';

// The one "heading + pink label + description" card used across the site
// (robots, about highlights, competitions). Its look lives in
// infoCardStyle.css; callers pass className only for layout — width and
// placement — never to restyle the card's text. An optional `badge` (e.g.
// "Work in Progress") sits between the heading and the label.
export default function InfoCard({ title, badge, tag, text, className }) {
    return (
        <div className={className ? `infoCard ${className}` : 'infoCard'}>
            <h3>{title}</h3>
            {badge && <span className="infoCardBadge">{badge}</span>}
            {tag && <span className="infoCardTag">{tag}</span>}
            <Paragraphs text={text} />
        </div>
    );
}
