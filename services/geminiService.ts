
import { GoogleGenAI, Type } from "@google/genai";
import type { MovieSummary, MovieDetail, PersonDetail } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const parseJsonResponse = <T,>(text: string): T | null => {
    try {
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText) as T;
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        console.error("Raw text:", text);
        return null;
    }
};

const movieSummarySchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique slug-like ID for the movie, e.g., 'the-godfather-1972'" },
        title: { type: Type.STRING },
        year: { type: Type.STRING },
        posterUrl: { type: Type.STRING, description: "A unique placeholder image URL from https://picsum.photos. Use the movie's ID as the seed for a unique image, e.g., 'https://picsum.photos/seed/the-godfather-1972/500/750'" },
        avgRating: { type: Type.NUMBER, description: "A float number between 1.0 and 5.0" },
    },
};

const personSummarySchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique slug-like ID for the person, e.g., 'marlon-brando'" },
        name: { type: Type.STRING },
        profileUrl: { type: Type.STRING, description: "A unique placeholder image URL from https://picsum.photos. Use the person's ID as a seed for a unique image, e.g., 'https://picsum.photos/seed/marlon-brando/200/200'" },
    },
};

export const searchMovies = async (query: string): Promise<MovieSummary[]> => {
    const prompt = `You are a movie database API. A user is searching for movies with the query: "${query}". The query could be a title or a genre. Return a list of up to 12 movies that match. Respond in JSON format.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    movies: {
                        type: Type.ARRAY,
                        items: movieSummarySchema,
                    },
                },
            },
        },
    });

    const data = parseJsonResponse<{ movies: MovieSummary[] }>(response.text);
    return data?.movies || [];
};

export const getPopularMovies = async (): Promise<MovieSummary[]> => {
    const prompt = `You are a movie database API. Return a list of 12 popular and critically acclaimed movies of all time. Respond in JSON format.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    movies: {
                        type: Type.ARRAY,
                        items: movieSummarySchema,
                    },
                },
            },
        },
    });

    const data = parseJsonResponse<{ movies: MovieSummary[] }>(response.text);
    return data?.movies || [];
};

export const getRecentlyReleasedMovies = async (): Promise<MovieSummary[]> => {
    const prompt = `You are a movie database API. Return a list of 12 interesting movies released in the last 2 years. Respond in JSON format.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    movies: {
                        type: Type.ARRAY,
                        items: movieSummarySchema,
                    },
                },
            },
        },
    });

    const data = parseJsonResponse<{ movies: MovieSummary[] }>(response.text);
    return data?.movies || [];
};

export const getMovieDetails = async (movieId: string, movieTitle: string): Promise<MovieDetail | null> => {
    const prompt = `You are a movie database API. Provide detailed information for the movie "${movieTitle}" with approximate ID "${movieId}". Include a detailed plot, genres, director, main cast, and some sample user reviews. Generate creative and plausible details. Ensure IDs for people are slug-like. Respond in JSON format.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique slug-like ID for the movie, e.g., 'the-godfather-1972'" },
                    title: { type: Type.STRING },
                    year: { type: Type.STRING },
                    posterUrl: { type: Type.STRING, description: "A unique placeholder image URL from https://picsum.photos. Use the movie's ID as the seed for a unique image, e.g., 'https://picsum.photos/seed/the-godfather-1972/500/750'" },
                    avgRating: { type: Type.NUMBER, description: "A float number between 1.0 and 5.0" },
                    plot: { type: Type.STRING, description: "A detailed plot summary of about 150-200 words." },
                    genres: { type: Type.ARRAY, items: { type: Type.STRING } },
                    director: personSummarySchema,
                    cast: { type: Type.ARRAY, items: personSummarySchema },
                    reviews: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                reviewer: { type: Type.STRING },
                                rating: { type: Type.NUMBER, description: "An integer rating from 1 to 5" },
                                text: { type: Type.STRING, description: "A short review text." },
                            },
                        },
                    },
                },
            },
        },
    });
    
    return parseJsonResponse<MovieDetail>(response.text);
};


export const getPersonDetails = async (personId: string, personName: string): Promise<PersonDetail | null> => {
    const prompt = `You are a movie database API. Provide detailed information for the person "${personName}" with approximate ID "${personId}". Include a detailed biography, birth date, profile picture, and a filmography of their most notable works as an actor or director. Generate creative and plausible details. Ensure IDs are slug-like. Respond in JSON format.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique slug-like ID for the person, e.g., 'marlon-brando'" },
                    name: { type: Type.STRING },
                    bio: { type: Type.STRING, description: "A biography of about 150-200 words." },
                    birthDate: { type: Type.STRING, description: "Full birth date, e.g., 'April 3, 1924'" },
                    profileUrl: { type: Type.STRING, description: "A unique placeholder image URL from https://picsum.photos. Use the person's ID as the seed for a unique image, e.g., 'https://picsum.photos/seed/marlon-brando/500/500'" },
                    filmography: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                movieId: { type: Type.STRING, description: "A unique slug-like ID for the movie" },
                                title: { type: Type.STRING },
                                year: { type: Type.STRING },
                                role: { type: Type.STRING, description: "Either 'Actor' or 'Director'" },
                            },
                        },
                    },
                },
            },
        },
    });
    
    return parseJsonResponse<PersonDetail>(response.text);
};
