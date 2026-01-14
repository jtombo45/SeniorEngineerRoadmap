# Contributing to Wild Rydes Tutorial

Thank you for your interest in contributing! This document provides guidelines for contributing to the Wild Rydes tutorial repository.

## How to Contribute

### Reporting Issues

If you find a bug, typo, or have a suggestion:

1. **Check existing issues** to see if it's already reported
2. **Create a new issue** with:
   - Clear title and description
   - Steps to reproduce (if it's a bug)
   - Expected vs. actual behavior
   - Screenshots (if helpful, but **no real AWS IDs/URLs**)

### Suggesting Improvements

We welcome improvements to:
- Documentation clarity
- Code examples
- Tutorial steps
- Architecture explanations
- Troubleshooting guides

Open an issue with the `enhancement` label or submit a pull request.

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes:**
   - Follow the existing code style
   - Update documentation if needed
   - **Never commit `js/config.js`** or any secrets

4. **Test your changes:**
   - Verify the tutorial still works
   - Check for typos and broken links
   - Ensure all placeholder values are used (no real IDs)

5. **Commit your changes:**
   ```bash
   git commit -m "Description of your changes"
   ```

6. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request:**
   - Provide a clear description
   - Reference any related issues
   - Wait for review

## Code Style Guidelines

### JavaScript
- Use consistent indentation (2 spaces or 4 spaces - match existing code)
- Add comments for complex logic
- Use meaningful variable names

### Documentation
- Use clear, beginner-friendly language
- Include code examples where helpful
- Keep paragraphs concise
- Use proper markdown formatting

### Configuration Files
- **Always use placeholders** in example files
- Never include real AWS resource IDs
- Use descriptive placeholder names (e.g., `YOUR_USER_POOL_ID`)

## Security Guidelines

**Critical:** Before submitting any PR:

- [ ] No real AWS resource IDs committed
- [ ] No secrets, tokens, or credentials
- [ ] `js/config.js` is in `.gitignore`
- [ ] All example files use placeholders
- [ ] Screenshots don't contain real IDs

See [SECURITY.md](SECURITY.md) for detailed guidelines.

## Documentation Contributions

When improving documentation:

- **README.md:** Main tutorial guide - keep it comprehensive but scannable
- **docs/ARCHITECTURE.md:** Technical deep-dive - explain concepts clearly
- **docs/QUICK_REFERENCE.md:** Quick lookup guide - be specific about locations
- **SECURITY.md:** Security best practices - be thorough

## Code Contributions

When improving code:

- Maintain backward compatibility when possible
- Add comments for non-obvious logic
- Test in a real AWS environment before submitting
- Update documentation if behavior changes

## Review Process

1. Maintainers will review your PR
2. Feedback may be requested
3. Once approved, your PR will be merged
4. Thank you for contributing! 🎉

## Questions?

- Open an issue with the `question` label
- Check existing issues and discussions
- Review the documentation first

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn
- Follow security best practices

Thank you for helping make this tutorial better!

