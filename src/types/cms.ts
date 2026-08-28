export interface CMSContent<T = unknown> {
  id: string;
  section_key: string;
  content_data: T;
  updated_at: string;
  created_at: string;
}

export interface CMSHeroSection {
  title: string;
  subtitle: string;
  primary_cta: string;
  secondary_cta: string;
  background_image?: string;
}

export interface CMSTrustBadge {
  title: string;
  desc: string;
  icon: string;
}

export interface CMSCategoryInfo {
  title: string;
  desc: string;
}

export interface CMSWhyUsFeature {
  title: string;
  desc: string;
  icon: string;
}

export interface CMSWorkflowStep {
  title: string;
  desc: string;
  step: string;
}

export interface CMSCTASection {
  title: string;
  desc: string;
  button_text: string;
}

export interface CMSAboutPage {
  hero: { headline: string; description: string; };
  history: { 
    title: string; 
    paragraphs: string[]; 
    mission_title: string; 
    missions: { title: string; desc: string; }[]; 
  };
  targets: { 
    title: string; 
    items: { icon: string; label: string; desc: string; }[]; 
  };
  management: { 
    title: string; 
    items: { name: string; role: string; description: string; }[]; 
  };
  legal_contact: { 
    legal_title: string; 
    legals: { icon: string; title: string; desc: string; }[]; 
    contact_title: string; 
    contacts: { icon: string; title: string; desc: string; }[]; 
  };
}

export interface CMSServicesPage {
  hero: {
    title: string;
    subtitle: string;
    image_url?: string;
  };
  services: {
    title: string;
    desc: string;
    icon: string;
  }[];
}
