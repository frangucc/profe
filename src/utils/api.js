// Auto-detect API URL based on environment
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:3002');

class ApiClient {
  constructor() {
    this.baseURL = `${API_URL}/api`;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.clearToken();
  }

  // Survey endpoints
  async getSurveyQuestions() {
    return this.request('/survey/questions');
  }

  async submitSurvey(responses) {
    return this.request('/survey/submit', {
      method: 'POST',
      body: JSON.stringify({ responses }),
    });
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getDashboardStats() {
    return this.request('/users/dashboard/stats');
  }

  async getAllUsers() {
    return this.request('/users');
  }

  // Course endpoints
  async getCourses(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/courses?${params}`);
  }

  async getCourse(id) {
    return this.request(`/courses/${id}`);
  }

  async enrollInCourse(id) {
    return this.request(`/courses/${id}/enroll`, {
      method: 'POST',
    });
  }

  async markContentComplete(contentId, quiz_score = null) {
    return this.request(`/courses/content/${contentId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ quiz_score }),
    });
  }

  async createCourse(courseData) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async createModule(courseId, moduleData) {
    return this.request(`/courses/${courseId}/modules`, {
      method: 'POST',
      body: JSON.stringify(moduleData),
    });
  }

  async createModuleContent(moduleId, contentData) {
    return this.request(`/courses/modules/${moduleId}/content`, {
      method: 'POST',
      body: JSON.stringify(contentData),
    });
  }

  // Badge endpoints
  async getBadges() {
    return this.request('/badges');
  }

  async getEarnedBadges() {
    return this.request('/badges/earned');
  }

  // Reference data endpoints
  async getAgeGroups() {
    return this.request('/reference/age-groups');
  }

  async getPositions(unit = null) {
    const params = unit ? `?unit=${unit}` : '';
    return this.request(`/reference/positions${params}`);
  }

  async getFormations() {
    return this.request('/reference/formations');
  }

  async getPhases() {
    return this.request('/reference/phases');
  }

  async getPrinciples(category = null) {
    const params = category ? `?category=${category}` : '';
    return this.request(`/reference/principles${params}`);
  }

  async getActionPatterns(type = null) {
    const params = type ? `?type=${type}` : '';
    return this.request(`/reference/action-patterns${params}`);
  }

  async getObjectives(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/reference/objectives?${params}`);
  }
}

export default new ApiClient();
