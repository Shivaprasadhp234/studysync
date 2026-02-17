'use server'

import { supabaseAdmin } from './supabase-admin';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

const DEMO_RESOURCES = [
    { title: "CS101: Introduction to Programming Final Paper", subject: "Computer Science", semester: "1", branch: "CSE", resource_type: "Paper", description: "Comprehensive final exam paper covering C basics and algorithms." },
    { title: "Data Structures Handwritten Notes (Lec 1-20)", subject: "Data Structures", semester: "3", branch: "CSE", resource_type: "Note", description: "Clear, handwritten notes on Trees, Graphs, and Hashmaps." },
    { title: "AI Project Report: Autonomous Drone Navigation", subject: "Artificial Intelligence", semester: "7", branch: "CSE", resource_type: "Project", description: "Full report including architecture diagrams and test results." },
    { title: "Circuit Analysis Previous Year Problems", subject: "Electrical Engineering", semester: "2", branch: "EE", resource_type: "Paper", description: "Solved problems from the last 5 years of university exams." },
    { title: "Thermodynamics Lab Manual & Notes", subject: "Mechanical Engineering", semester: "4", branch: "ME", resource_type: "Note", description: "Complete lab manual with observations and result calculations." },
    { title: "Database Systems: SQL Cheat Sheet", subject: "DBMS", semester: "5", branch: "IT", resource_type: "Other", description: "Quick reference for Joins, Subqueries, and Normalization." },
    { title: "Compiler Design Assignment: Lexical Analyzer", subject: "Compiler Design", semester: "6", branch: "CSE", resource_type: "Assignment", description: "Implementation details and test cases for the first assignment." },
    { title: "Mobile App Development: Flutter Basics", subject: "App Development", semester: "5", branch: "CSE", resource_type: "Note", description: "Introduction to Widgets, State Management, and Navigation." },
    { title: "Ethical Hacking Workshop Resources", subject: "Cyber Security", semester: "6", branch: "IT", resource_type: "Other", description: "Tools and techniques shared during the security workshop." },
    { title: "Strength of Materials Question Bank", subject: "Mechanical Engineering", semester: "3", branch: "ME", resource_type: "Paper", description: "Important questions and diagrams for internal assessments." }
];

// Mock file URL for demo purposes
const MOCK_FILE_URL = "https://example.com/demo-resource.pdf";

export async function seedDemoData() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Not authenticated");
    }

    // Insert resources using the current user as the uploader
    const resourcesToInsert = DEMO_RESOURCES.map(res => ({
        ...res,
        uploader_id: userId,
        file_url: MOCK_FILE_URL,
        privacy: 'public',
        created_at: new Date().toISOString()
    }));

    const { error } = await supabaseAdmin
        .from('resources')
        .insert(resourcesToInsert);

    if (error) {
        console.error("Demo Seed Error:", error);
        throw new Error(`Failed to seed demo data: ${error.message}`);
    }

    revalidatePath('/dashboard');
    revalidatePath('/resources');
    return { success: true, count: DEMO_RESOURCES.length };
}
