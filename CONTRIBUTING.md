# Contributing to Biomarkr

Thank you for your interest in contributing to Biomarkr! We welcome contributions from developers, healthcare professionals, and users who want to improve personal health data tracking.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful, inclusive, and constructive in all interactions.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Basic knowledge of React, TypeScript, and health data concepts

### Development Setup
```bash
# Fork the repository and clone your fork
git clone https://github.com/your-username/biomarkr-app.git
cd biomarkr-app

# Install dependencies
npm install

# Start development server
npm run dev

# Run in demo mode for testing
# Open browser console and run: forceDemoMode()
```

## 📋 How to Contribute

### 🐛 Reporting Bugs
1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include steps to reproduce, expected vs actual behavior
4. Add relevant screenshots or error messages
5. Specify your environment (browser, OS, device)

### ✨ Suggesting Features
1. Check existing feature requests
2. Use the feature request template
3. Explain the use case and expected behavior
4. Consider privacy and security implications
5. Provide mockups or examples if helpful

### 💻 Code Contributions

#### Types of Contributions Needed
- **New biomarker panels** and health metrics
- **Data visualization** improvements
- **Mobile responsiveness** enhancements
- **Accessibility** improvements
- **Performance** optimizations
- **Security** enhancements
- **Documentation** updates
- **Testing** coverage
- **Internationalization** (i18n)

#### Pull Request Process
1. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards:
   - Use TypeScript with strict typing
   - Follow existing component patterns
   - Write descriptive commit messages
   - Include comments for complex logic
   - Ensure responsive design
   - Test in demo mode

3. **Test thoroughly**:
   ```bash
   npm run lint          # Check code style
   npm run type-check    # TypeScript validation
   npm run build         # Ensure it builds
   ```

4. **Commit with conventional format**:
   ```bash
   git commit -m "feat: add new biomarker panel for microbiome analysis"
   git commit -m "fix: resolve profile switching issue in demo mode"
   git commit -m "docs: update deployment instructions for mobile"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Fill out PR template** with:
   - Clear description of changes
   - Testing performed
   - Screenshots (if UI changes)
   - Breaking changes (if any)

## 🎯 Development Guidelines

### Code Style
- **Components**: Use functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **Files**: Match component names, use kebab-case for utilities
- **Imports**: Group by type (external, internal, relative)
- **CSS**: Use Tailwind classes, avoid custom CSS when possible

### Health Data Considerations
- **Privacy First**: No data should leave the user's device by default
- **Medical Accuracy**: Ensure biomarker references are medically accurate
- **Accessibility**: Health apps must be accessible to all users
- **Error Handling**: Graceful handling of invalid health data
- **Disclaimers**: Always include appropriate medical disclaimers

### Component Structure
```typescript
// components/NewComponent.tsx
interface NewComponentProps {
  data: HealthData[];
  onAction: (id: string) => void;
}

export function NewComponent({ data, onAction }: NewComponentProps) {
  // Component logic
  return (
    <div className="space-y-4">
      {/* Component JSX */}
    </div>
  );
}
```

### Adding New Biomarkers
```typescript
// In mockData.ts
case 'New Panel Name':
  biomarkers = [
    { 
      name: 'Biomarker Name', 
      value: 'calculated_value', 
      unit: 'unit', 
      referenceRange: { min: 0, max: 100 },
      range: '0-100 unit'
    }
  ];
  break;
```

## 🏥 Health & Medical Guidelines

### Medical Accuracy
- Reference ranges must be clinically accurate
- Use established medical sources (LabCorp, Quest, Mayo Clinic)
- Include appropriate units and conversion factors
- Consider age, gender, and population variations

### Data Privacy
- Never log sensitive health data
- Use generic examples in code comments
- Implement proper data sanitization
- Follow HIPAA principles even for personal use

### User Safety
- Include medical disclaimers
- Don't provide medical advice
- Encourage professional consultation
- Handle edge cases gracefully

## 📱 Platform-Specific Contributions

### Web Application
- Focus on Progressive Web App (PWA) features
- Ensure offline functionality
- Optimize for mobile browsers
- Test across different screen sizes

### Desktop Application (Electron)
- Native system integration
- File system operations
- Auto-updater implementation
- Platform-specific features

### Mobile Application (Capacitor)
- Native device features
- App store compliance
- Touch interactions
- Performance optimization

## 🧪 Testing

### Manual Testing Checklist
- [ ] Demo mode functionality
- [ ] Profile switching
- [ ] Data persistence
- [ ] Responsive design
- [ ] Accessibility (keyboard, screen readers)
- [ ] Performance (large datasets)
- [ ] Error states and edge cases

### Automated Testing (Future)
- Unit tests for utility functions
- Integration tests for data flow
- End-to-end tests for critical paths
- Visual regression tests

## 📚 Documentation

### Code Documentation
- Document complex health calculations
- Explain biomarker significance
- Include usage examples
- Maintain API consistency

### User Documentation
- Update user guides for new features
- Include screenshots and examples
- Consider different user skill levels
- Translate key content when possible

## 🔄 Release Process

### Versioning
We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Release Types
- **Alpha**: Early development, frequent changes
- **Beta**: Feature-complete, testing phase
- **Stable**: Production-ready releases

## 🎉 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Documentation credits
- Optional LinkedIn recommendations

## ❓ Questions?

- **General Questions**: [GitHub Discussions](https://github.com/your-username/biomarkr-app/discussions)
- **Development Help**: [Discord Community](#) (coming soon)
- **Security Issues**: Email biomarkr_app_sec@icloud.com privately
- **Medical Questions**: Consult healthcare professionals

## 📋 Contributor Checklist

Before submitting your first contribution:
- [ ] Read and understand the Code of Conduct
- [ ] Set up development environment
- [ ] Test the demo mode thoroughly
- [ ] Join community discussions
- [ ] Identify an issue to work on
- [ ] Introduce yourself in discussions

Thank you for contributing to better health data tracking! 🙏