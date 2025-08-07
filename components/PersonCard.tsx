
import React from 'react';
import { Link } from 'react-router-dom';
import type { PersonSummary } from '../types';

interface PersonCardProps {
  person: PersonSummary;
  role: string;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, role }) => {
  return (
    <Link to={`/person/${person.id}/${encodeURIComponent(person.name)}`} className="block bg-secondary rounded-lg p-3 text-center hover:bg-tertiary transition-colors duration-200">
      <img src={person.profileUrl} alt={person.name} className="w-24 h-24 rounded-full mx-auto object-cover mb-3 shadow-lg" />
      <h4 className="font-bold text-text-primary">{person.name}</h4>
      <p className="text-sm text-text-secondary">{role}</p>
    </Link>
  );
};

export default PersonCard;
