"use client";

import { X, MapPin, Search, Filter, Sparkles, ChevronDown, DollarSign, Globe, Building, Briefcase, Clock, TrendingUp, Zap, CheckCircle, Map, Loader2, Sliders, Star, Heart, Award, Target, Compass, Navigation, Radio, Layers, Gem, Crown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jobService } from "@/services/jobService";

export default function FilterSidebar({ isOpen, onClose, filters, onFilterChange }) {
  const [isClient, setIsClient] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    jobType: "",
    jobCategory: "",
    experienceLevel: "",
    minSalary: "",
    maxSalary: "",
    isRemote: false,
    country: "",
    city: "",
    state: "",
    zipCode: "",
    location: "",
  });
  
  const [categories, setCategories] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationFilterType, setLocationFilterType] = useState('all');
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    category: true,
    jobType: true,
    experience: true,
    country: true,
    salary: true
  });
  const [isHovering, setIsHovering] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize local filters from props
  useEffect(() => {
    if (!isClient) return;
    
    setLocalFilters({
      jobType: filters.jobType || "",
      jobCategory: filters.jobCategory || "",
      experienceLevel: filters.experienceLevel || "",
      minSalary: filters.minSalary || "",
      maxSalary: filters.maxSalary || "",
      isRemote: filters.isRemote || false,
      country: filters.country || "",
      city: filters.city || "",
      state: filters.state || "",
      zipCode: filters.zipCode || "",
      location: filters.location || "",
    });

    // Set location search field
    if (filters.city) {
      setLocationSearch(filters.city);
      setLocationFilterType('city');
    } else if (filters.state) {
      setLocationSearch(filters.state);
      setLocationFilterType('state');
    } else if (filters.zipCode) {
      setLocationSearch(filters.zipCode);
      setLocationFilterType('zip');
    } else if (filters.location) {
      setLocationSearch(filters.location);
      setLocationFilterType('all');
    } else {
      setLocationSearch('');
      setLocationFilterType('all');
    }
  }, [filters, isClient]);

  // Load filter options
  useEffect(() => {
    if (!isClient) return;
    
    const loadFilterOptions = async () => {
      try {
        const filterData = await jobService.getJobFilters();
        setCategories(filterData.jobCategories || jobService.getJobCategories());
        setJobTypes(filterData.jobTypes || jobService.getJobTypes());
        setExperienceLevels(filterData.experienceLevels || jobService.getExperienceLevels());
        setCountries(filterData.countries || jobService.getCountries());
        setCities(filterData.cities || []);
        setStates(filterData.states || jobService.getUSStates());
      } catch (error) {
        console.error("Failed to load filter options:", error);
        // Fallback to static data
        setCategories(jobService.getJobCategories());
        setJobTypes(jobService.getJobTypes());
        setExperienceLevels(jobService.getExperienceLevels());
        setCountries(jobService.getCountries());
        setStates(jobService.getUSStates());
      }
    };
    
    loadFilterOptions();
  }, [isClient]);

  // Generate location suggestions
  useEffect(() => {
    if (!isClient) return;
    
    if (locationSearch.length >= 2) {
      const suggestions = [];
      
      // Add city suggestions
      if (locationFilterType === 'city' || locationFilterType === 'all') {
        const cityMatches = (cities.length > 0 ? cities : [
          "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", 
          "London", "Manchester", "Toronto", "Vancouver", "Sydney",
          "Melbourne", "Dhaka", "Mumbai", "Delhi", "Bangalore"
        ])
          .filter(city => city.toLowerCase().includes(locationSearch.toLowerCase()))
          .slice(0, 5)
          .map(city => ({ type: 'city', value: city, label: city }));
        suggestions.push(...cityMatches);
      }
      
      // Add state suggestions
      if (locationFilterType === 'state' || locationFilterType === 'all') {
        const stateMatches = (states.length > 0 ? states : [
          "California", "Texas", "Florida", "New York", "Illinois",
          "Pennsylvania", "Ohio", "Georgia", "North Carolina", "Michigan"
        ])
          .filter(state => state.toLowerCase().includes(locationSearch.toLowerCase()))
          .slice(0, 5)
          .map(state => ({ type: 'state', value: state, label: state }));
        suggestions.push(...stateMatches);
      }
      
      // Add country suggestions
      if (locationFilterType === 'all') {
        const countryMatches = (countries.length > 0 ? countries : jobService.getCountries())
          .filter(country => country.toLowerCase().includes(locationSearch.toLowerCase()))
          .slice(0, 3)
          .map(country => ({ type: 'country', value: country, label: country }));
        suggestions.push(...countryMatches);
      }
      
      // Check if it looks like a zip code
      if (/^\d{5}/.test(locationSearch) && (locationFilterType === 'zip' || locationFilterType === 'all')) {
        suggestions.push({ type: 'zip', value: locationSearch, label: locationSearch });
      }
      
      setLocationSuggestions(suggestions.slice(0, 8));
    } else {
      setLocationSuggestions([]);
    }
  }, [locationSearch, locationFilterType, cities, states, countries, isClient]);

  const handleInputChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleLocationTypeChange = (type) => {
    setLocationFilterType(type);
    setLocationSearch('');
    
    // Clear location fields when switching types
    setLocalFilters(prev => ({
      ...prev,
      city: '',
      state: '',
      zipCode: '',
      location: '',
      isRemote: type === 'remote' ? true : prev.isRemote
    }));
  };

  const handleLocationSelect = (suggestion) => {
    setLocationSearch(suggestion.label);
    setShowLocationSuggestions(false);
    
    // Clear previous location filters
    const updatedFilters = { ...localFilters };
    delete updatedFilters.city;
    delete updatedFilters.state;
    delete updatedFilters.zipCode;
    delete updatedFilters.location;
    
    // Set new location filter
    if (suggestion.type === 'city') {
      updatedFilters.city = suggestion.value;
      setLocationFilterType('city');
    } else if (suggestion.type === 'state') {
      updatedFilters.state = suggestion.value;
      setLocationFilterType('state');
    } else if (suggestion.type === 'zip') {
      updatedFilters.zipCode = suggestion.value;
      setLocationFilterType('zip');
    } else if (suggestion.type === 'country') {
      updatedFilters.country = suggestion.value;
    }
    
    setLocalFilters(updatedFilters);
  };

  const handleApplyFilters = () => {
    // Prepare final filters object
    const finalFilters = {};
    
    // Only include non-empty values
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== '' && value !== false && value !== null && value !== undefined) {
        finalFilters[key] = value;
      }
    });
    
    // Add location search if set and no specific location filter
    if (locationSearch && !finalFilters.city && !finalFilters.state && !finalFilters.zipCode) {
      finalFilters.location = locationSearch;
    }
    
    onFilterChange(finalFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      jobType: "",
      jobCategory: "",
      experienceLevel: "",
      minSalary: "",
      maxSalary: "",
      isRemote: false,
      country: "",
      city: "",
      state: "",
      zipCode: "",
      location: "",
    };
    setLocalFilters(clearedFilters);
    setLocationSearch('');
    setLocationFilterType('all');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Count active filters
  const activeFiltersCount = Object.entries(localFilters).filter(
    ([key, value]) => 
      value !== "" && 
      value !== false && 
      !['location', 'page', 'limit'].includes(key)
  ).length;

  // Animation variants
  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 200,
        duration: 0.5
      }
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -3, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Don't render sidebar content until client-side
  if (!isClient) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with blur effect */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 h-full w-[340px] bg-gradient-to-b from-white to-gray-50/90 z-50 shadow-2xl overflow-y-auto"
          >
            {/* Decorative animated elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div 
                className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 45, 0]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, -45, 0]
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />
            </div>

            {/* Decorative gradient line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
            
            {/* Header */}
            <motion.div 
              variants={fadeInUp}
              className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-between px-4 py-3 border-b border-gray-200/80"
            >
              <div className="flex items-center gap-2">
                <motion.div 
                  variants={pulseAnimation}
                  animate="animate"
                  className="relative"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <motion.div 
                    className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-30 blur"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <h2 className="text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center gap-1">
                    Filters
                    <motion.span
                      variants={floatingAnimation}
                      animate="animate"
                    >
                      <Sparkles className="w-3 h-3 text-blue-500" />
                    </motion.span>
                  </h2>
                  <p className="text-[9px] text-gray-500">Refine your job search</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {activeFiltersCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] px-2 py-0.5 rounded-full"
                  >
                    {activeFiltersCount}
                  </motion.span>
                )}
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose} 
                  className="hover:bg-gray-100 p-1.5 rounded-lg transition-all duration-300 group"
                >
                  <X className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700" />
                </motion.button>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="p-4 space-y-3"
            >
              {/* Active Filters Summary */}
              <AnimatePresence>
                {activeFiltersCount > 0 && (
                  <motion.div 
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-3 rounded-xl border border-blue-100/50"
                  >
                    <p className="text-[9px] font-medium text-blue-700 mb-2 flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5" />
                      Active Filters ({activeFiltersCount})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(localFilters).map(([key, value]) => {
                        if (!value || value === "" || value === false || key === 'page' || key === 'limit' || key === 'location') return null;
                        
                        let displayValue = value;
                        let displayKey = key;
                        let icon = null;
                        
                        switch(key) {
                          case 'jobType':
                            displayKey = 'Type';
                            icon = <Briefcase className="w-2.5 h-2.5" />;
                            break;
                          case 'jobCategory':
                            displayKey = 'Cat';
                            icon = <Building className="w-2.5 h-2.5" />;
                            break;
                          case 'experienceLevel':
                            displayKey = 'Exp';
                            icon = <TrendingUp className="w-2.5 h-2.5" />;
                            break;
                          case 'minSalary':
                            displayKey = 'Min';
                            displayValue = `$${Number(value).toLocaleString()}`;
                            icon = <DollarSign className="w-2.5 h-2.5" />;
                            break;
                          case 'maxSalary':
                            displayKey = 'Max';
                            displayValue = `$${Number(value).toLocaleString()}`;
                            icon = <DollarSign className="w-2.5 h-2.5" />;
                            break;
                          case 'isRemote':
                            displayKey = 'Remote';
                            displayValue = 'Yes';
                            icon = <Globe className="w-2.5 h-2.5" />;
                            break;
                          case 'country':
                            displayKey = 'Country';
                            icon = <Globe className="w-2.5 h-2.5" />;
                            break;
                          case 'city':
                            displayKey = 'City';
                            icon = <MapPin className="w-2.5 h-2.5" />;
                            break;
                          case 'state':
                            displayKey = 'State';
                            icon = <Map className="w-2.5 h-2.5" />;
                            break;
                          case 'zipCode':
                            displayKey = 'ZIP';
                            icon = <MapPin className="w-2.5 h-2.5" />;
                            break;
                        }
                        
                        return (
                          <motion.span
                            key={`active-${key}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                            className="group text-[8px] bg-white text-blue-700 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300"
                          >
                            {icon}
                            <span className="font-medium">{displayKey}:</span> {displayValue}
                            <X 
                              className="w-2 h-2 cursor-pointer hover:text-red-500 transition-colors duration-300 ml-0.5" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInputChange(key, '');
                                if (key === 'isRemote') handleInputChange(key, false);
                                if (['city', 'state', 'zipCode'].includes(key)) {
                                  setLocationSearch('');
                                }
                              }}
                            />
                          </motion.span>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Location Filter Section */}
              <FilterSection
                title="Location"
                icon={<MapPin className="w-4 h-4" />}
                expanded={expandedSections.location}
                onToggle={() => toggleSection('location')}
                isHovering={isHovering === 'location'}
                onHover={() => setIsHovering('location')}
                onLeave={() => setIsHovering(null)}
              >
                {/* Location Type Tabs */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {[
                    { type: 'all', label: 'All', icon: <Globe className="w-2.5 h-2.5" />, color: 'from-blue-500 to-indigo-500' },
                    { type: 'city', label: 'City', icon: <MapPin className="w-2.5 h-2.5" />, color: 'from-green-500 to-emerald-500' },
                    { type: 'state', label: 'State', icon: <Map className="w-2.5 h-2.5" />, color: 'from-purple-500 to-pink-500' },
                    { type: 'zip', label: 'ZIP', icon: <Navigation className="w-2.5 h-2.5" />, color: 'from-amber-500 to-orange-500' },
                    { type: 'remote', label: 'Remote', icon: <Globe className="w-2.5 h-2.5" />, color: 'from-cyan-500 to-teal-500' }
                  ].map(({ type, label, icon, color }) => (
                    <motion.button
                      key={`location-tab-${type}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLocationTypeChange(type)}
                      className={`flex-1 min-w-[50px] px-1.5 py-1 text-[8px] rounded-lg flex items-center justify-center gap-0.5 transition-all duration-300 ${
                        locationFilterType === type 
                          ? `bg-gradient-to-r ${color} text-white shadow-md` 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {icon}
                      <span>{label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Location Search Input */}
                {locationFilterType !== 'remote' && (
                  <div className="relative">
                    <div className="group flex items-center gap-1.5 border border-gray-200 rounded-lg px-2 py-1.5 bg-white hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
                      <Search className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                      <input
                        type="text"
                        placeholder={
                          locationFilterType === 'city' ? "Enter city..." :
                          locationFilterType === 'state' ? "Enter state..." :
                          locationFilterType === 'zip' ? "Enter ZIP..." :
                          "City, state, or ZIP..."
                        }
                        value={locationSearch}
                        onChange={(e) => {
                          setLocationSearch(e.target.value);
                          setShowLocationSuggestions(true);
                        }}
                        onFocus={() => setShowLocationSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                        className="w-full text-[9px] outline-none bg-transparent"
                      />
                    </div>

                    {/* Location Suggestions */}
                    <AnimatePresence>
                      {showLocationSuggestions && locationSuggestions.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto"
                        >
                          {locationSuggestions.map((suggestion, index) => (
                            <motion.button
                              key={`suggestion-${index}`}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.02 }}
                              whileHover={{ x: 2 }}
                              onClick={() => handleLocationSelect(suggestion)}
                              className="w-full text-left px-3 py-1.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-[9px] text-gray-700 flex items-center gap-2 transition-all duration-300 group"
                            >
                              <MapPin className="w-2.5 h-2.5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                              <span className="flex-1">{suggestion.label}</span>
                              <span className="text-[7px] px-1 py-0.5 bg-gray-100 rounded-full text-gray-500">
                                {suggestion.type}
                              </span>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Remote Toggle */}
                {locationFilterType === 'remote' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"
                  >
                    <div>
                      <span className="text-[9px] font-medium text-gray-700 flex items-center gap-1">
                        <Globe className="w-2.5 h-2.5 text-blue-600" />
                        Remote Jobs Only
                      </span>
                      <p className="text-[7px] text-gray-500 mt-0.5">Show only remote positions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.isRemote}
                        onChange={(e) => {
                          handleInputChange('isRemote', e.target.checked);
                          if (e.target.checked) {
                            setLocalFilters(prev => ({
                              ...prev,
                              city: '',
                              state: '',
                              zipCode: '',
                              location: ''
                            }));
                            setLocationSearch('');
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600"></div>
                    </label>
                  </motion.div>
                )}
              </FilterSection>

              {/* Job Category Section */}
              <FilterSection
                title="Job Category"
                icon={<Layers className="w-4 h-4" />}
                expanded={expandedSections.category}
                onToggle={() => toggleSection('category')}
                isHovering={isHovering === 'category'}
                onHover={() => setIsHovering('category')}
                onLeave={() => setIsHovering(null)}
              >
                <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                  <FilterRadio
                    name="jobCategory"
                    value=""
                    checked={!localFilters.jobCategory}
                    onChange={() => handleInputChange('jobCategory', '')}
                    label="All Categories"
                  />
                  {(categories.length > 0 ? categories : jobService.getJobCategories()).map((category) => (
                    <FilterRadio
                      key={`category-${category}`}
                      name="jobCategory"
                      value={category}
                      checked={localFilters.jobCategory === category}
                      onChange={() => handleInputChange('jobCategory', category)}
                      label={category}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Job Type Section */}
              <FilterSection
                title="Job Type"
                icon={<Briefcase className="w-4 h-4" />}
                expanded={expandedSections.jobType}
                onToggle={() => toggleSection('jobType')}
                isHovering={isHovering === 'jobType'}
                onHover={() => setIsHovering('jobType')}
                onLeave={() => setIsHovering(null)}
              >
                <div className="space-y-1">
                  <FilterRadio
                    name="jobType"
                    value=""
                    checked={!localFilters.jobType}
                    onChange={() => handleInputChange('jobType', '')}
                    label="All Types"
                  />
                  {(jobTypes.length > 0 ? jobTypes : jobService.getJobTypes()).map((type) => (
                    <FilterRadio
                      key={`jobtype-${type}`}
                      name="jobType"
                      value={type}
                      checked={localFilters.jobType === type}
                      onChange={() => handleInputChange('jobType', type)}
                      label={type}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Experience Level Section */}
              <FilterSection
                title="Experience"
                icon={<Award className="w-4 h-4" />}
                expanded={expandedSections.experience}
                onToggle={() => toggleSection('experience')}
                isHovering={isHovering === 'experience'}
                onHover={() => setIsHovering('experience')}
                onLeave={() => setIsHovering(null)}
              >
                <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                  <FilterRadio
                    name="experienceLevel"
                    value=""
                    checked={!localFilters.experienceLevel}
                    onChange={() => handleInputChange('experienceLevel', '')}
                    label="All Levels"
                  />
                  {(experienceLevels.length > 0 ? experienceLevels : jobService.getExperienceLevels()).map((level) => (
                    <FilterRadio
                      key={`exp-${level}`}
                      name="experienceLevel"
                      value={level}
                      checked={localFilters.experienceLevel === level}
                      onChange={() => handleInputChange('experienceLevel', level)}
                      label={level}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Country Section */}
              <FilterSection
                title="Country"
                icon={<Globe className="w-4 h-4" />}
                expanded={expandedSections.country}
                onToggle={() => toggleSection('country')}
                isHovering={isHovering === 'country'}
                onHover={() => setIsHovering('country')}
                onLeave={() => setIsHovering(null)}
              >
                <select
                  value={localFilters.country || ''}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[9px] bg-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                >
                  <option value="">All Countries</option>
                  {(countries.length > 0 ? countries : jobService.getCountries()).map((country) => (
                    <option key={`country-${country}`} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </FilterSection>

              {/* Salary Range Section */}
              <FilterSection
                title="Salary Range"
                icon={<Gem className="w-4 h-4" />}
                expanded={expandedSections.salary}
                onToggle={() => toggleSection('salary')}
                isHovering={isHovering === 'salary'}
                onHover={() => setIsHovering('salary')}
                onLeave={() => setIsHovering(null)}
              >
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[7px] font-medium text-gray-500 mb-0.5 block">Minimum</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-gray-400 text-[8px]">$</span>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        value={localFilters.minSalary || ''}
                        onChange={(e) => handleInputChange('minSalary', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg pl-5 pr-2 py-1.5 text-[8px] bg-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[7px] font-medium text-gray-500 mb-0.5 block">Maximum</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1.5 text-gray-400 text-[8px]">$</span>
                      <input
                        type="number"
                        placeholder="200k"
                        min="0"
                        value={localFilters.maxSalary || ''}
                        onChange={(e) => handleInputChange('maxSalary', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg pl-5 pr-2 py-1.5 text-[8px] bg-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-1.5 text-[6px] text-gray-400 flex items-center gap-0.5">
                  <Clock className="w-2 h-2" />
                  Yearly salary
                </div>
              </FilterSection>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="sticky bottom-0 bg-white/95 backdrop-blur-sm p-4 border-t border-gray-200/80"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApplyFilters}
                className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg text-[10px] font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 overflow-hidden group mb-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center justify-center gap-1">
                  <Filter className="w-3 h-3" />
                  Apply Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[8px]">
                      {activeFiltersCount}
                    </span>
                  )}
                </span>
              </motion.button>
              
              {activeFiltersCount > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClearFilters}
                  className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-lg text-[10px] font-medium hover:bg-gray-50 transition-all duration-300 group"
                >
                  <span className="flex items-center justify-center gap-1">
                    <X className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                    Clear All Filters
                  </span>
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Filter Section Component
function FilterSection({ title, icon, children, expanded, onToggle, isHovering, onHover, onLeave }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2.5 hover:bg-gray-50/50 transition-colors duration-300"
      >
        <div className="flex items-center gap-2">
          <motion.div 
            animate={isHovering ? { scale: [1, 1.1, 1], rotate: [0, 5, 0] } : {}}
            transition={{ duration: 0.3 }}
            className="p-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"
          >
            <div className="text-blue-600 w-3.5 h-3.5">{icon}</div>
          </motion.div>
          <span className="text-[10px] font-medium text-gray-700">{title}</span>
        </div>
        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-2.5 pb-2.5"
          >
            <div className="pt-2 border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Filter Radio Component
function FilterRadio({ name, value, checked, onChange, label }) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer p-1 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-300 group">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="accent-blue-600 w-2.5 h-2.5"
      />
      <span className="text-[9px] text-gray-700 group-hover:text-blue-600 transition-colors duration-300 flex-1">
        {label}
      </span>
    </label>
  );
}