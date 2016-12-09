/**
 * Global hooks
 */

before(() => {
	// Clears console every time tests run.
	process.stdout.write('\x1Bc\n\n'); 
});

beforeEach(() => {
	// Before every test case.
});

after(() => {
	process.stdout.write('  __________________________________\n\n');
});

afterEach(() => {
	// After every test case.
});