import React from 'react';
import content from "../content.json";
import MemberCard from './MemberCard';
import '../styles/teamStyle.css';

function TeamGroup({ name, subtitle, members, featured = false }) {
    const count = `${members.length} ${members.length === 1 ? 'member' : 'members'}`;

    return (
        <section className={`teamGroup${featured ? ' teamGroupFeatured' : ''}`}>
            <header className="teamGroupHeader">
                <h3>{name}</h3>
                {subtitle && <p className="teamGroupSubtitle">{subtitle}</p>}
                <p className="teamGroupCount">{count}</p>
            </header>
            <div className="teamGrid">
                {members.map((member, index) => (
                    <MemberCard key={`${member.name}-${index}`} {...member} />
                ))}
            </div>
        </section>
    );
}

export default function Team() {
    const { intro, leadership, subteams } = content.team;

    return (
        <div className="infoBlock" id="teamBlock">
            <h2 className="sectionTitle">Our Team</h2>
            {intro && <p className="teamIntro">{intro}</p>}
            <TeamGroup name="Leadership" members={leadership} featured />
            {subteams
                .filter((subteam) => subteam.members?.length > 0)
                .map((subteam) => (
                    <TeamGroup key={subteam.name} {...subteam} />
                ))}
        </div>
    );
}
