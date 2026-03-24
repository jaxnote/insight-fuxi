import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import GlobalNav from '../../src/components/GlobalNav';
import { BrowserRouter } from 'react-router-dom';

describe('GlobalNav Theme Switcher', () => {
  beforeEach(() => {
    // Reset document body class before each test
    document.body.className = '';
  });

  const renderNav = () => {
    return render(
      <BrowserRouter>
        <GlobalNav />
      </BrowserRouter>
    );
  };

  it('renders the theme switcher', () => {
    renderNav();
    expect(screen.getByRole('button', { name: '切换主题' })).toBeInTheDocument();
  });

  it('applies the default theme to the document body', () => {
    renderNav();
    // Assuming 'theme-cyber' is the default theme
    expect(document.body.classList.contains('theme-cyber')).toBe(true);
  });

  it('changes the theme class on the document body when a theme is selected', () => {
    renderNav();
    
    // Open dropdown
    const toggleBtn = screen.getByRole('button', { name: '切换主题' });
    fireEvent.click(toggleBtn);
    
    // Select 'theme-saas'
    const saasThemeOption = screen.getByTitle('现代SaaS风');
    fireEvent.click(saasThemeOption);
    
    expect(document.body.classList.contains('theme-saas')).toBe(true);
    expect(document.body.classList.contains('theme-cyber')).toBe(false);

    // Open dropdown again
    fireEvent.click(toggleBtn);
    
    // Select 'theme-corporate'
    const corporateThemeOption = screen.getByTitle('商务风');
    fireEvent.click(corporateThemeOption);
    
    expect(document.body.classList.contains('theme-corporate')).toBe(true);
    expect(document.body.classList.contains('theme-saas')).toBe(false);
  });
});
