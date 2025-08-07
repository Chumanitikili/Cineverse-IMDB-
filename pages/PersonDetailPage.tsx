
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPersonDetails } from '../services/geminiService';
import type { PersonDetail } from '../types';
import Loader from '../components/Loader';

const PersonDetailPage: React.FC = () => {
  const { id, name } = useParams<{ id: string; name: string }>();
  const [person, setPerson] = useState<PersonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && name) {
      const fetchPerson = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getPersonDetails(id, decodeURIComponent(name));
          setPerson(data);
        } catch (err) {
          setError('Failed to fetch person details.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPerson();
    }
  }, [id, name]);

  if (isLoading) return <Loader message={`Finding details for ${decodeURIComponent(name || '')}...`} />;
  if (error) return <div className="text-center py-20 text-accent text-xl">{error}</div>;
  if (!person) return <div className="text-center py-20 text-text-secondary text-xl">Person not found.</div>;

  return (
    <div className="space-y-12">
      {/* Person Header */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4 flex-shrink-0">
          <img src={person.profileUrl} alt={person.name} className="rounded-lg shadow-xl w-full aspect-square object-cover" />
        </div>
        <div className="md:w-3/4">
          <h1 className="text-4xl lg:text-5xl font-bold text-white">{person.name}</h1>
          <p className="text-lg text-text-secondary mt-2">Born: {person.birthDate}</p>
          <h2 className="text-2xl font-bold mt-8 mb-3 border-l-4 border-accent pl-4">Biography</h2>
          <p className="text-text-secondary leading-relaxed">{person.bio}</p>
        </div>
      </div>

      {/* Filmography Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6 border-l-4 border-accent pl-4">Known For</h2>
        <div className="bg-secondary rounded-lg shadow-lg overflow-hidden">
          <ul className="divide-y divide-tertiary">
            {person.filmography.map((item) => (
              <li key={item.movieId} className="p-4 hover:bg-tertiary transition-colors duration-200">
                <Link to={`/movie/${item.movieId}/${encodeURIComponent(item.title)}`} className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg text-white">{item.title}</span>
                    <span className="text-text-secondary ml-3">({item.year})</span>
                  </div>
                  <span className="bg-primary text-accent text-xs font-bold px-3 py-1 rounded-full">{item.role}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage;
