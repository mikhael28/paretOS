import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContextPage from '../src/context/ContextPage';
import props from './CPProps.json';

describe("Accordion test", () => {
    test("should show title all the time", () => {

        render(<ContextPage sanitySchemas={props.sanitySchemas} />);

        expect(screen.getByText(/Testing/i)).toBeDefined()
    })
})