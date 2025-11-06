# Contributing to Clusteer

Thank you for your interest in contributing to Clusteer! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A Supabase account (for database)
- Basic knowledge of Next.js, TypeScript, and React

### Setting Up Development Environment

1. **Fork and clone the repository**

\`\`\`bash
git clone https://github.com/your-username/clusteer.git
cd clusteer-unified
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**

\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your values
\`\`\`

4. **Set up Supabase database**

Follow the instructions in README.md to run the migration files.

5. **Start development server**

\`\`\`bash
npm run dev
\`\`\`

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Pull Request

1. **Create a new branch**

\`\`\`bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
\`\`\`

2. **Make your changes**

- Write clean, readable code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

3. **Test your changes**

\`\`\`bash
npm run lint          # Check for linting errors
npm run type-check    # Check for TypeScript errors
npm test              # Run tests
npm run build         # Ensure build succeeds
\`\`\`

4. **Commit your changes**

Use conventional commit messages:

\`\`\`bash
git commit -m "feat: add user profile edit feature"
git commit -m "fix: resolve balance calculation bug"
git commit -m "docs: update API documentation"
\`\`\`

Commit types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

5. **Push and create PR**

\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

Then create a Pull Request on GitHub.

## Code Style Guide

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type - use proper typing
- Use type guards when necessary

\`\`\`typescript
// Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

function updateProfile(profile: UserProfile): void {
  // implementation
}

// Bad
function updateProfile(profile: any): void {
  // implementation
}
\`\`\`

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

\`\`\`typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// Bad
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
\`\`\`

### API Routes

- Use the `withMiddleware` wrapper for authentication and rate limiting
- Validate all inputs
- Return consistent response formats
- Handle errors properly

\`\`\`typescript
import { withMiddleware, errorResponse, successResponse } from '@/lib/api-middleware';
import { RATE_LIMITS } from '@/lib/rate-limiter';

export const POST = withMiddleware(
  async (request) => {
    const body = await request.json();

    // Validate input
    if (!body.amount || body.amount <= 0) {
      return errorResponse('Invalid amount', 400);
    }

    // Business logic
    const result = await processTransaction(body);

    return successResponse(result, 'Transaction successful');
  },
  {
    requireAuth: true,
    rateLimit: RATE_LIMITS.API_DEFAULT,
  }
);
\`\`\`

### Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Interfaces/Types**: PascalCase (`UserProfile`)

### Code Organization

\`\`\`typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface ProfileProps {
  userId: string;
}

// 3. Constants
const MAX_NAME_LENGTH = 50;

// 4. Component
export function UserProfile({ userId }: ProfileProps) {
  // Hooks
  const [name, setName] = useState('');

  // Event handlers
  const handleSubmit = () => {
    // implementation
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
\`\`\`

## Testing Guidelines

### Writing Tests

- Write tests for all new features
- Test edge cases and error conditions
- Use descriptive test names
- Keep tests isolated and independent

\`\`\`typescript
describe('UserProfile', () => {
  it('should display user name when loaded', () => {
    // Test implementation
  });

  it('should show error message when name is too long', () => {
    // Test implementation
  });

  it('should disable submit button while saving', () => {
    // Test implementation
  });
});
\`\`\`

### Running Tests

\`\`\`bash
npm test                  # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
\`\`\`

## Documentation

### Code Comments

- Use JSDoc for public functions
- Explain "why" not "what"
- Keep comments up-to-date

\`\`\`typescript
/**
 * Calculate exchange rate with premium based on transaction type.
 * Buy orders get 2% premium (better rate for users).
 * Sell orders get 2.5% premium (standard market rate).
 *
 * @param baseRate - The base exchange rate
 * @param type - Transaction type ('buy' or 'sell')
 * @returns Calculated rate with premium applied
 */
function calculateRate(baseRate: number, type: 'buy' | 'sell'): number {
  const premium = type === 'buy' ? 0.02 : 0.025;
  return baseRate * (1 + premium);
}
\`\`\`

### Updating Documentation

When making changes that affect:
- API endpoints - Update API documentation
- Configuration - Update README.md
- Security - Update SECURITY.md
- Environment variables - Update .env.example

## Security Guidelines

### Never Commit Sensitive Data

- API keys, passwords, private keys
- Environment files (`.env.local`)
- Database credentials

### Security-Sensitive Changes

Changes affecting security require extra review:
- Authentication/authorization logic
- Payment processing
- User data handling
- API rate limiting
- Input validation

### Reporting Security Issues

Do NOT create public issues for security vulnerabilities.
See SECURITY.md for how to report security issues.

## Review Process

### Pull Request Checklist

Before requesting review, ensure:

- [ ] Code follows style guidelines
- [ ] Tests are written and passing
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors
- [ ] Documentation is updated
- [ ] Commits follow conventional commit format
- [ ] PR description explains the changes
- [ ] Related issues are linked

### Review Criteria

Reviewers will check:

- Code quality and readability
- Test coverage
- Security considerations
- Performance implications
- Breaking changes
- Documentation completeness

### Getting Your PR Merged

1. Address all review comments
2. Ensure CI/CD pipeline passes
3. Get approval from at least one maintainer
4. Squash commits if needed
5. Maintainer will merge

## Common Tasks

### Adding a New API Endpoint

1. Create route file in `src/app/api/`
2. Use `withMiddleware` wrapper
3. Add input validation
4. Implement business logic
5. Add tests
6. Update API documentation

### Adding a New Component

1. Create component file in `src/components/`
2. Define proper TypeScript types
3. Add to appropriate index file
4. Write tests
5. Update Storybook (if applicable)

### Adding a Database Table

1. Create migration file in `supabase/migrations/`
2. Add RLS policies
3. Update TypeScript types
4. Document in README.md

## Getting Help

- Check existing issues and discussions
- Ask in Discord/Slack (if available)
- Review documentation and code examples
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Clusteer! 🚀
