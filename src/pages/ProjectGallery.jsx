import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, MapPin, Calendar, Building2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ScrollFadeSection from "../components/ScrollFadeSection";

export default function ProjectGallery() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Bay Area Transit Hub",
      location: "San Francisco, CA",
      category: "infrastructure",
      date: "2023",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
      description: "Complete SWPPP implementation and structural inspection for major transit infrastructure project.",
      services: ["SWPPP Development", "Special Inspections", "Civil Engineering"],
      scope: "50,000 sq ft development with complex drainage systems and seismic requirements"
    },
    {
      id: 2,
      title: "Residential Complex Development",
      location: "Oakland, CA",
      category: "residential",
      date: "2023",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      description: "Multi-family residential development with comprehensive stormwater management and structural engineering.",
      services: ["SWPPP Services", "Construction Management", "Testing & Sampling"],
      scope: "250-unit residential complex with on-site detention and treatment systems"
    },
    {
      id: 3,
      title: "Commercial Office Tower",
      location: "San Jose, CA",
      category: "commercial",
      date: "2024",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      description: "High-rise commercial development with advanced stormwater controls and structural inspections.",
      services: ["Structural Engineering", "Special Inspections", "SWPPP Implementation"],
      scope: "15-story office building with underground parking and rooftop BMP systems"
    },
    {
      id: 4,
      title: "Highway Extension Project",
      location: "San Mateo County, CA",
      category: "infrastructure",
      date: "2023",
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800",
      description: "Major highway infrastructure with extensive erosion control and drainage systems.",
      services: ["SWPPP Development", "Erosion Control", "Civil Engineering"],
      scope: "5-mile highway extension with complex stormwater collection and treatment"
    },
    {
      id: 5,
      title: "Mixed-Use Development",
      location: "Berkeley, CA",
      category: "commercial",
      date: "2024",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
      description: "Urban mixed-use development integrating retail, residential, and public spaces.",
      services: ["SWPPP Services", "Construction Services", "Inspections & Testing"],
      scope: "200,000 sq ft mixed-use with innovative green infrastructure solutions"
    },
    {
      id: 6,
      title: "Waterfront Renovation",
      location: "Richmond, CA",
      category: "infrastructure",
      date: "2023",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
      description: "Historic waterfront area renovation with environmental restoration.",
      services: ["Environmental Compliance", "SWPPP Implementation", "Site Development"],
      scope: "Waterfront redevelopment with habitat restoration and stormwater treatment"
    },
    {
      id: 7,
      title: "Suburban Housing Expansion",
      location: "Fremont, CA",
      category: "residential",
      date: "2024",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      description: "Large-scale residential subdivision with comprehensive site development.",
      services: ["SWPPP Development", "Grading & Utilities", "Construction Management"],
      scope: "150-home subdivision with integrated stormwater management system"
    },
    {
      id: 8,
      title: "Industrial Park Expansion",
      location: "Hayward, CA",
      category: "commercial",
      date: "2023",
      image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800",
      description: "Industrial facility expansion with advanced pollution prevention measures.",
      services: ["SWPPP Services", "Special Inspections", "Environmental Testing"],
      scope: "300,000 sq ft industrial development with specialized drainage requirements"
    }
  ];

  const categories = [
    { value: "all", label: "All Projects" },
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "infrastructure", label: "Infrastructure" }
  ];

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-blue-900 to-cyan-800 overflow-hidden">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600')] bg-cover bg-center" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-white mb-6 pt-40 text-5xl font-bold md:text-6xl">
            Project Gallery
          </h1>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto leading-relaxed">
            Explore our portfolio of successful projects across the Bay Area. From residential developments to major infrastructure, see how we deliver compliance and excellence.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <ScrollFadeSection>
        <section className="py-12 px-6 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  variant={filter === cat.value ? "default" : "outline"}
                  className={`${
                    filter === cat.value
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } px-6`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </section>
      </ScrollFadeSection>

      {/* Projects Grid */}
      <ScrollFadeSection>
        <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-blue-600">
                        {project.date}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{project.location}</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.services.slice(0, 2).map((service, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                      {project.services.length > 2 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                          +{project.services.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </ScrollFadeSection>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative h-96">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
                  {selectedProject.date}
                </span>
                <span className="bg-cyan-100 text-cyan-700 px-4 py-1 rounded-full text-sm font-medium capitalize">
                  {selectedProject.category}
                </span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedProject.title}
              </h2>
              
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin className="w-5 h-5" />
                <span>{selectedProject.location}</span>
              </div>
              
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {selectedProject.description}
              </p>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Project Scope</h3>
                <p className="text-gray-700 leading-relaxed">{selectedProject.scope}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Services Provided</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 px-4 py-2 rounded-lg font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  Start a Project Like This
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <ScrollFadeSection>
        <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Let's discuss how we can bring the same level of excellence and compliance to your construction project.
            </p>
            
            <Link to={createPageUrl("Contact")}>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
                Get in Touch
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </ScrollFadeSection>
    </div>
  );
}