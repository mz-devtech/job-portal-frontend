"use client";

import { X, MapPin, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { jobService } from "@/services/jobService";

export default function FilterSidebar({ isOpen, onClose, filters, onFilterChange }) {
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
  const [locationFilterType, setLocationFilterType] = useState('all'); // 'city', 'state', 'zip', 'remote'

  // Initialize local filters from props
  useEffect(() => {
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
  }, [filters]);

  // Load filter options
  useEffect(() => {
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
  }, []);

  // Generate location suggestions
  useEffect(() => {
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
          .map(city => ({ type: 'city', value: city, label: `📍 ${city}` }));
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
          .map(state => ({ type: 'state', value: state, label: `🏛️ ${state}` }));
        suggestions.push(...stateMatches);
      }
      
      // Add country suggestions
      if (locationFilterType === 'all') {
        const countryMatches = (countries.length > 0 ? countries : jobService.getCountries())
          .filter(country => country.toLowerCase().includes(locationSearch.toLowerCase()))
          .slice(0, 3)
          .map(country => ({ type: 'country', value: country, label: `🌍 ${country}` }));
        suggestions.push(...countryMatches);
      }
      
      // Check if it looks like a zip code
      if (/^\d{5}/.test(locationSearch) && (locationFilterType === 'zip' || locationFilterType === 'all')) {
        suggestions.push({ type: 'zip', value: locationSearch, label: `📮 ${locationSearch}` });
      }
      
      setLocationSuggestions(suggestions.slice(0, 8));
    } else {
      setLocationSuggestions([]);
    }
  }, [locationSearch, locationFilterType, cities, states, countries]);

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
    setLocationSearch(suggestion.value);
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

  // Count active filters
  const activeFiltersCount = Object.entries(localFilters).filter(
    ([key, value]) => 
      value !== "" && 
      value !== false && 
      !['location', 'page', 'limit'].includes(key)
  ).length;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[400px] bg-white z-50 shadow-lg transform transition-transform duration-300 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg">Filters</h2>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-700 mb-2">
                Active Filters:
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(localFilters).map(([key, value]) => {
                  if (!value || value === "" || value === false || key === 'page' || key === 'limit' || key === 'location') return null;
                  
                  let displayValue = value;
                  let displayKey = key;
                  
                  switch(key) {
                    case 'jobType':
                      displayKey = 'Job Type';
                      break;
                    case 'jobCategory':
                      displayKey = 'Category';
                      break;
                    case 'experienceLevel':
                      displayKey = 'Experience';
                      break;
                    case 'minSalary':
                      displayKey = 'Min Salary';
                      displayValue = `$${Number(value).toLocaleString()}`;
                      break;
                    case 'maxSalary':
                      displayKey = 'Max Salary';
                      displayValue = `$${Number(value).toLocaleString()}`;
                      break;
                    case 'isRemote':
                      displayKey = 'Remote';
                      displayValue = 'Yes';
                      break;
                    case 'country':
                      displayKey = 'Country';
                      break;
                    case 'city':
                      displayKey = 'City';
                      break;
                    case 'state':
                      displayKey = 'State';
                      break;
                    case 'zipCode':
                      displayKey = 'ZIP Code';
                      break;
                  }
                  
                  return (
                    <span
                      key={key}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full flex items-center gap-1"
                    >
                      {displayKey}: {displayValue}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-blue-900" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInputChange(key, '');
                          if (key === 'isRemote') handleInputChange(key, false);
                          if (['city', 'state', 'zipCode'].includes(key)) {
                            setLocationSearch('');
                          }
                        }}
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Location Filter */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-semibold">Location</p>
            </div>
            
            {/* Location Type Tabs */}
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => handleLocationTypeChange('all')}
                className={`px-3 py-1.5 text-xs rounded-full transition ${
                  locationFilterType === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 border hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleLocationTypeChange('city')}
                className={`px-3 py-1.5 text-xs rounded-full transition ${
                  locationFilterType === 'city' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 border hover:bg-gray-50'
                }`}
              >
                City
              </button>
              <button
                onClick={() => handleLocationTypeChange('state')}
                className={`px-3 py-1.5 text-xs rounded-full transition ${
                  locationFilterType === 'state' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 border hover:bg-gray-50'
                }`}
              >
                State
              </button>
              <button
                onClick={() => handleLocationTypeChange('zip')}
                className={`px-3 py-1.5 text-xs rounded-full transition ${
                  locationFilterType === 'zip' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 border hover:bg-gray-50'
                }`}
              >
                ZIP Code
              </button>
              <button
                onClick={() => handleLocationTypeChange('remote')}
                className={`px-3 py-1.5 text-xs rounded-full transition ${
                  locationFilterType === 'remote' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 border hover:bg-gray-50'
                }`}
              >
                Remote Only
              </button>
            </div>

            {/* Location Search Input */}
            {locationFilterType !== 'remote' && (
              <div className="relative">
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={
                      locationFilterType === 'city' ? "Enter city name..." :
                      locationFilterType === 'state' ? "Enter state name..." :
                      locationFilterType === 'zip' ? "Enter ZIP code..." :
                      "Enter city, state, or ZIP code..."
                    }
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setShowLocationSuggestions(true);
                    }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                    className="w-full text-sm outline-none"
                  />
                </div>

                {/* Location Suggestions */}
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    {locationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleLocationSelect(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
                      >
                        <span>{suggestion.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Remote Toggle */}
            {locationFilterType === 'remote' && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mt-2">
                <div>
                  <span className="text-sm font-medium">Remote Jobs Only</span>
                  <p className="text-xs text-gray-500">Show only remote positions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.isRemote}
                    onChange={(e) => {
                      handleInputChange('isRemote', e.target.checked);
                      if (e.target.checked) {
                        // Clear other location filters when remote is selected
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            )}
          </div>

          {/* Job Category */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold mb-3">Job Category</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded transition">
                <input
                  type="radio"
                  name="jobCategory"
                  value=""
                  checked={!localFilters.jobCategory}
                  onChange={(e) => handleInputChange('jobCategory', e.target.value)}
                  className="accent-blue-600"
                />
                <span className="text-sm">All Categories</span>
              </label>
              {(categories.length > 0 ? categories : jobService.getJobCategories()).map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded transition">
                  <input
                    type="radio"
                    name="jobCategory"
                    value={category}
                    checked={localFilters.jobCategory === category}
                    onChange={(e) => handleInputChange('jobCategory', e.target.value)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Job Type */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold mb-3">Job Type</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded transition">
                <input
                  type="radio"
                  name="jobType"
                  value=""
                  checked={!localFilters.jobType}
                  onChange={(e) => handleInputChange('jobType', e.target.value)}
                  className="accent-blue-600"
                />
                <span className="text-sm">All Types</span>
              </label>
              {(jobTypes.length > 0 ? jobTypes : jobService.getJobTypes()).map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded transition">
                  <input
                    type="radio"
                    name="jobType"
                    value={type}
                    checked={localFilters.jobType === type}
                    onChange={(e) => handleInputChange('jobType', e.target.value)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold mb-3">Experience Level</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded transition">
                <input
                  type="radio"
                  name="experienceLevel"
                  value=""
                  checked={!localFilters.experienceLevel}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                  className="accent-blue-600"
                />
                <span className="text-sm">All Levels</span>
              </label>
              {(experienceLevels.length > 0 ? experienceLevels : jobService.getExperienceLevels()).map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded transition">
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={level}
                    checked={localFilters.experienceLevel === level}
                    onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Country */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold mb-3">Country</p>
            <select
              value={localFilters.country || ''}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full border rounded-lg px-3 py-2.5 text-sm bg-white"
            >
              <option value="">All Countries</option>
              {(countries.length > 0 ? countries : jobService.getCountries()).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Salary Range */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold mb-2">Salary Range (yearly)</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Min Salary</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={localFilters.minSalary || ''}
                    onChange={(e) => handleInputChange('minSalary', e.target.value)}
                    className="w-full border rounded-lg pl-7 pr-3 py-2 text-sm bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Max Salary</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="200k"
                    min="0"
                    value={localFilters.maxSalary || ''}
                    onChange={(e) => handleInputChange('maxSalary', e.target.value)}
                    className="w-full border rounded-lg pl-7 pr-3 py-2 text-sm bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white pt-4 space-y-3 border-t mt-6">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}