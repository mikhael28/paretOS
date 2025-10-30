import { useState, useEffect, SetStateAction, Dispatch, KeyboardEventHandler, KeyboardEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { I18n } from "@aws-amplify/core";
import { AppBar, Tabs, Tab, Box, TextField, InputAdornment, FormControl, Select, MenuItem, InputLabel, Chip } from "@mui/material";
import Tour from "reactour";
import imageUrlBuilder from "@sanity/image-url";
import classNames from "classnames";
import { LibraryEntry } from "../types/ContextTypes";
import ContextObject from "./ContextObject";
import question from "../assets/question.svg";
import sanity from "../libs/sanity";
import TabPanel from "../components/TabPanel";
import { sanityObjects } from "../offline-data/sanity-objects";

const builder = imageUrlBuilder(sanity);

/**
 * The ContextBuilder component is the main dashboard for the Library of Context.
 *
 */

// Auto-categorize resources based on keywords in their titles
const categorizeResource = (resource: any) => {
  const title = resource.title?.toLowerCase() || '';
  
  // Define category patterns
  if (title.includes('react') || title.includes('vue') || title.includes('angular') || 
      title.includes('javascript') || title.includes('typescript') || title.includes('css') ||
      title.includes('html') || title.includes('web')) {
    return 'Web Development';
  }
  if (title.includes('security') || title.includes('csrf') || title.includes('sql injection') ||
      title.includes('auth')) {
    return 'Security';
  }
  if (title.includes('design') || title.includes('ui') || title.includes('ux') || 
      title.includes('color') || title.includes('font')) {
    return 'Design & UX';
  }
  if (title.includes('job') || title.includes('work') || title.includes('hire') || 
      title.includes('career') || title.includes('interview') || title.includes('freelanc')) {
    return 'Career & Jobs';
  }
  if (title.includes('startup') || title.includes('founder') || title.includes('vc') ||
      title.includes('incubat') || title.includes('venture') || title.includes('capital')) {
    return 'Startups & Funding';
  }
  if (title.includes('community') || title.includes('meetup') || title.includes('club') ||
      title.includes('group')) {
    return 'Communities';
  }
  if (title.includes('learn') || title.includes('tutorial') || title.includes('course') ||
      title.includes('academy') || title.includes('training')) {
    return 'Learning Resources';
  }
  if (title.includes('tool') || title.includes('library') || title.includes('framework') ||
      title.includes('service') || title.includes('api')) {
    return 'Tools & Services';
  }
  if (title.includes('africa') || title.includes('nigeria') || title.includes('uganda') ||
      title.includes('costa rica') || title.includes('seattle')) {
    return 'Regional';
  }
  
  return 'Other';
};

interface ContextBuilderProps {
  navigate: typeof useNavigate;
  sanitySchemas: {
    technicalSchemas: LibraryEntry[];
    economicSchemas: LibraryEntry[]
    hubSchemas: LibraryEntry[];
  }
}

function ContextBuilder(props: ContextBuilderProps) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = props.navigate();

  // Get unique categories from all resources
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    sanityObjects.forEach(item => {
      cats.add(categorizeResource(item));
    });
    return Array.from(cats).sort();
  }, []);

  // Filter resources based on search and category
  const filteredItems = useMemo(() => {
    let filtered = sanityObjects || [];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.url?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(item => 
        categorizeResource(item) === selectedCategory
      );
    }
    
    return filtered;
  }, [searchTerm, selectedCategory]);

  const handleResourceClick = (item: any) => {
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const steps = [
    {
      selector: ".search-resources",
      content: "Search for resources by typing keywords",
    },
    {
      selector: ".filter-category",
      content: "Filter resources by category",
    },
    {
      selector: ".resource-card",
      content: "Click on any resource to open it in a new tab",
    },
  ];

  return (
    <div>
      <h1>
        {I18n.get("library")}
        <Box
          component="img"
          src={question}
          height={18}
          width={18}
          sx={{
            opacity: 0.8,
            filter: "invert()",
            margin: '8px 8px 14px 8px',
            cursor: 'pointer'
          }}
          onClick={() => setIsTourOpen(true)}
        />
      </h1>
      
      {/* Search and Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <TextField
          className="search-resources"
          label="Search Resources"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                🔍
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl className="filter-category" sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Results count */}
      <Box sx={{ mb: 2 }}>
        <Chip 
          label={`${filteredItems.length} resources found`} 
          color="primary" 
          variant="outlined"
        />
        {selectedCategory !== 'All' && (
          <Chip 
            label={selectedCategory}
            onDelete={() => setSelectedCategory('All')}
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      {/* Resource Grid */}
      <div className="context-cards" style={{ padding: '20px 0' }}>
        {filteredItems.map((item: any) => {
          const category = categorizeResource(item);
          return (
            <div
              key={item.id}
              className="context-card resource-card"
              style={{ 
                cursor: item.url ? 'pointer' : 'default',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                marginBottom: '16px',
                transition: 'all 0.3s ease',
                position: 'relative',
                minHeight: '100px'
              }}
              onClick={() => handleResourceClick(item)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{item.title}</h3>
                  <Chip 
                    label={category} 
                    size="small" 
                    sx={{ mb: 1 }}
                    variant="outlined"
                  />
                  {item.summary && (
                    <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>{item.summary}</p>
                  )}
                  {item.url && (
                    <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.url}
                    </p>
                  )}
                </div>
                {item.url && (
                  <span 
                    style={{ 
                      fontSize: '20px', 
                      opacity: 0.6,
                      marginLeft: '8px'
                    }} 
                  >
                    ↗
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        showCloseButton
      />
    </div>
  );
}

export default ContextBuilder;
