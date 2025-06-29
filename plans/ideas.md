# Scotus Data Viz Project Plan

This document outlines ideas for a React application to visualize data from the Supreme Court's most recent term. The goal is to create an interesting and useful tool for users to understand voting patterns and alignments among the justices.

## Core Features

### 1. Term Overview Dashboard

A high-level summary of the term's statistics. This will be the landing page and provide a snapshot of the court's activity.

*   **Key Metrics:**
    *   Total number of cases decided.
    *   Percentage of unanimous decisions.
    *   Most frequent vote split (e.g., 5-4, 9-0).
*   **Visualizations:**
    *   A bar chart showing the distribution of vote splits (9-0, 8-1, 7-2, 6-3, 5-4).
    *   A pie chart illustrating the breakdown of decision types (e.g., Affirmed, Reversed, Reversed and remanded).

### 2. Justice Agreement Matrix

An interactive heatmap that shows how frequently each pair of justices voted together. This will be a central feature for exploring ideological alignments.

*   **Functionality:**
    *   The matrix will have all nine justices on both the X and Y axes.
    *   The color of each cell will represent the percentage of cases in which the two corresponding justices voted in the same bloc (majority or dissent).
    *   Hovering over a cell will show the exact percentage and the number of cases.
    *   Users can click on a justice's name to filter the view and highlight their agreements.

### 3. Case Explorer

A detailed, filterable table of all the cases from the term. This allows users to dig into specific decisions.

*   **Functionality:**
    *   Columns for Case Title, Date, Vote Split, and Majority Opinion Author.
    *   Filtering options:
        *   Filter by justice (show all cases where a specific justice was in the majority or dissent).
        *   Filter by vote split.
    *   Clicking on a case row could expand to show more details, including which justices were in the majority, concurrence, and dissent, with a link to the full opinion.

## Advanced Feature Ideas

### 4. Ideological Spectrum

A more advanced visualization to plot justices on an ideological spectrum.

*   **Concept:**
    *   Use voting data to place each justice on a one-dimensional line from "more liberal" to "more conservative".
    *   This could be calculated based on who they vote with most often. For example, justices who frequently vote together would be placed closer to each other on the spectrum.

### 5. Opinion Authorship Analysis

A section to explore who writes opinions and in what types of cases.

*   **Visualizations:**
    *   A bar chart showing the number of majority, concurring, and dissenting opinions authored by each justice.
    *   Analysis of which justices tend to write for the majority in closely divided cases.

## Technical Implementation Sketch

*   **Frontend:** React (using Vite, as set up).
*   **Data:** The provided `scData.json` will be the primary data source. It can be loaded directly into the React application.
*   **State Management:** React's `useState` and `useContext` should be sufficient for managing state, such as selected filters or justices.
*   **Visualizations:** A library like [D3.js](https://d3js.org/) or [Chart.js](https://www.chartjs.org/) could be integrated with React to create the charts and the agreement matrix.

This plan provides a roadmap for building a compelling data visualization tool. We can start with the core features and then move on to the more advanced ideas.
