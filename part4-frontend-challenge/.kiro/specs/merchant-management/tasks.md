# Implementation Plan: Merchant Management

- [x] 1. Create merchant type definitions





  - Create `src/types/merchant.ts` with Merchant, MerchantResponse, MerchantApiResponse, PaginationInfo, and MerchantFilterState interfaces
  - Define DEFAULT_MERCHANT_FILTERS constant
  - Ensure types match the backend API response structure
  - _Requirements: 1.1, 1.5, 7.5_

- [x] 2. Implement merchant service layer







  - [ ] 2.1 Create `src/services/merchantService.ts` with getMerchants function
    - Implement query parameter construction from filter state
    - Handle API response unwrapping (extract data from wrapped response)
    - Use existing API utility functions (get, post, etc.)
    - _Requirements: 7.1, 7.2, 7.5_

  - [ ]* 2.2 Write property test for query parameter construction
    - **Property 18: Service constructs correct query parameters**

    - **Validates: Requirements 7.2**

  - [ ] 2.3 Add getMerchantById function
    - Implement single merchant fetch by ID
    - Handle response unwrapping
    - _Requirements: 7.1, 7.5_

  - [ ]* 2.4 Write unit tests for merchant service
    - Test getMerchants with various filter combinations
    - Test error handling scenarios
    - Test response parsing
    - _Requirements: 7.1, 7.2, 7.4, 7.5_

- [x] 3. Create useMerchants custom hook




  - [x] 3.1 Implement `src/hooks/useMerchants.ts` with state management


    - Manage data, loading, and error states
    - Implement refetch function
    - Add debouncing for search queries (300ms)
    - Trigger refetch when filters change
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

  - [ ]* 3.2 Write property test for filter change triggering refetch
    - **Property 15: Filter changes trigger refetch**
    - **Validates: Requirements 6.2**

  - [ ]* 3.3 Write property test for search debouncing
    - **Property 17: Search queries are debounced**
    - **Validates: Requirements 6.5**

  - [ ]* 3.4 Write property test for hook state structure
    - **Property 14: useMerchants hook provides required state**
    - **Validates: Requirements 6.1**

  - [ ]* 3.5 Write unit tests for useMerchants hook
    - Test initial loading state
    - Test successful data fetch
    - Test error handling
    - Test refetch functionality
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 4. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create MerchantFilters component





  - [x] 5.1 Implement `src/components/merchants/MerchantFilters.tsx`


    - Add search input field
    - Add status filter dropdown
    - Add clear filters button
    - Handle user input and trigger callbacks
    - _Requirements: 2.1, 2.4, 5.1_

  - [ ]* 5.2 Write unit tests for MerchantFilters
    - Test search input changes
    - Test status filter changes
    - Test clear filters action
    - _Requirements: 2.1, 2.4, 5.1_

- [x] 6. Create MerchantList component





  - [x] 6.1 Implement `src/components/merchants/MerchantList.tsx` with table structure


    - Set up component with useMerchants hook
    - Implement filter state management
    - Create table with columns: merchantId, merchantCode, merchantName, contactEmail, status, city, country
    - Add loading state with LoadingSpinner
    - Add error state with error message and retry button
    - Add empty state for no merchants
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 8.1, 8.3_

  - [ ]* 6.2 Write property test for merchant table display
    - **Property 1: Merchant table displays all merchants with required columns**
    - **Validates: Requirements 1.1**

  - [ ]* 6.3 Write property test for loading state
    - **Property 20: Loading state displays indicator**
    - **Validates: Requirements 1.2, 8.1, 8.2**



  - [ ] 6.2 Add sorting functionality to table headers
    - Make column headers clickable
    - Implement sort state management
    - Add visual indicators for sort column and direction
    - Update filters when sort changes
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

  - [ ]* 6.3 Write property test for sorting
    - **Property 5: Sorting orders merchants correctly by column**
    - **Validates: Requirements 3.1, 3.2, 3.3**

  - [ ]* 6.4 Write property test for sort toggle
    - **Property 6: Sort toggle reverses order**


    - **Validates: Requirements 3.2**

  - [ ] 6.4 Integrate MerchantFilters component
    - Add MerchantFilters to MerchantList
    - Wire up filter callbacks
    - Ensure filters update merchant list
    - _Requirements: 2.1, 2.4, 5.1_

  - [ ]* 6.5 Write property test for search filtering
    - **Property 2: Search filters return only matching merchants**
    - **Validates: Requirements 2.1, 2.2, 2.3**

  - [ ]* 6.6 Write property test for status filtering
    - **Property 3: Status filter returns only merchants with specified status**
    - **Validates: Requirements 2.4, 5.1, 5.2**



  - [ ]* 6.7 Write property test for filter combination
    - **Property 11: Multiple filters combine with AND logic**
    - **Validates: Requirements 5.3**

  - [ ] 6.5 Add pagination controls
    - Create pagination UI with page numbers, previous/next buttons
    - Display current page, total pages, and total count
    - Handle page navigation
    - Show/hide pagination based on result count
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 6.8 Write property test for pagination display
    - **Property 8: Pagination displays correct merchant subset**
    - **Validates: Requirements 4.2, 4.3, 4.4**

  - [ ]* 6.9 Write property test for pagination controls visibility
    - **Property 9: Pagination controls appear when needed**


    - **Validates: Requirements 4.1**

  - [ ]* 6.10 Write property test for pagination info accuracy
    - **Property 10: Pagination info is accurate**
    - **Validates: Requirements 4.5**

  - [ ] 6.6 Implement consistent data formatting
    - Format dates consistently (createdAt, updatedAt)
    - Format status badges with consistent styling


    - Format currency values (dailyTxnLimit, monthlyTxnLimit)
    - Format contact information consistently
    - _Requirements: 1.5_

  - [ ]* 6.11 Write property test for consistent formatting
    - **Property 22: Consistent formatting across rows**
    - **Validates: Requirements 1.5**

  - [ ] 6.7 Add interactive element disabling during loading
    - Disable search input during loading
    - Disable filter dropdowns during loading
    - Disable pagination buttons during loading
    - _Requirements: 8.5_

  - [ ]* 6.12 Write property test for disabled elements during loading
    - **Property 21: Interactive elements disabled during loading**
    - **Validates: Requirements 8.5**

  - [ ]* 6.13 Write unit tests for MerchantList component
    - Test component renders with mock data
    - Test loading state display
    - Test error state display
    - Test empty state display
    - Test filter interactions
    - Test pagination interactions
    - Test sorting interactions
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 3.1, 4.1_

- [x] 7. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Create merchant list styles






  - [x] 8.1 Create `src/components/merchants/MerchantList.css`

    - Style merchant table with proper spacing and borders
    - Style filter controls
    - Style pagination controls
    - Style loading and error states
    - Style status badges (active, inactive, pending)
    - Ensure responsive design
    - _Requirements: 1.1, 1.2, 1.4_


  - [x] 8.2 Create `src/components/merchants/MerchantFilters.css`

    - Style search input
    - Style filter dropdowns
    - Style clear filters button
    - Ensure consistent spacing
    - _Requirements: 2.1, 5.1_

- [x] 9. Integrate MerchantList into Merchants page




  - [x] 9.1 Update `src/pages/Merchants.tsx` to use MerchantList component


    - Replace placeholder content with MerchantList
    - Add page header and title
    - Ensure proper layout
    - _Requirements: 1.1_

  - [ ]* 9.2 Write integration test for complete merchant management flow
    - Test full user flow: load page → search → filter → sort → paginate
    - Test error recovery flow
    - Test filter clearing flow
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [ ] 10. Add property tests for filter invariants
  - [ ]* 10.1 Write property test for operations preserving filter state
    - **Property 7: Operations preserve filter state**
    - **Validates: Requirements 3.4, 4.6**

  - [ ]* 10.2 Write property test for clearing search
    - **Property 4: Clearing search returns all merchants**
    - **Validates: Requirements 2.5**

  - [ ]* 10.3 Write property test for filter removal
    - **Property 12: Filter removal expands results appropriately**
    - **Validates: Requirements 5.4**

  - [ ]* 10.4 Write property test for displayed count accuracy
    - **Property 13: Displayed count matches actual results**
    - **Validates: Requirements 5.5**

  - [ ]* 10.5 Write property test for refetch function
    - **Property 16: Refetch function reloads data**
    - **Validates: Requirements 6.3**

  - [ ]* 10.6 Write property test for service response types
    - **Property 19: Service returns properly typed responses**
    - **Validates: Requirements 7.5**

- [x] 11. Final Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Add create and update functions to merchant service





  - [x] 12.1 Add createMerchant function to merchantService


    - Implement POST request to /api/v1/merchants
    - Accept CreateMerchantRequest parameter
    - Return CreateMerchantResponse
    - Handle API errors appropriately
    - _Requirements: 13.1, 13.3, 13.5_

  - [ ]* 12.2 Write property test for createMerchant
    - **Property 41: createMerchant sends POST to correct endpoint**
    - **Validates: Requirements 13.1**

  - [ ]* 12.3 Write property test for createMerchant return value
    - **Property 43: createMerchant returns created merchant**
    - **Validates: Requirements 13.3**

  - [x] 12.4 Add updateMerchant function to merchantService

    - Implement PUT request to /api/v1/merchants/:id
    - Accept merchantId and UpdateMerchantRequest parameters
    - Return UpdateMerchantResponse
    - Handle API errors appropriately
    - _Requirements: 13.2, 13.4, 13.5_

  - [ ]* 12.5 Write property test for updateMerchant
    - **Property 42: updateMerchant sends PUT to correct endpoint**
    - **Validates: Requirements 13.2**

  - [ ]* 12.6 Write property test for updateMerchant return value
    - **Property 44: updateMerchant returns updated merchant**
    - **Validates: Requirements 13.4**

  - [ ]* 12.7 Write property test for service error handling
    - **Property 45: Service functions throw on API errors**
    - **Validates: Requirements 13.5**

  - [ ]* 12.8 Write unit tests for create and update functions
    - Test createMerchant with mock data
    - Test updateMerchant with mock data
    - Test error handling scenarios
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 13. Update type definitions for create/update operations




  - [x] 13.1 Add CreateMerchantRequest interface to merchant types

    - Define all required fields for merchant creation
    - _Requirements: 9.2, 9.6_


  - [ ] 13.2 Add UpdateMerchantRequest interface to merchant types
    - Define fields that can be updated (name, email, phone, limits, status)
    - _Requirements: 10.2, 10.3_


  - [ ] 13.3 Add CreateMerchantResponse interface
    - Define response structure (merchantId, merchantCode, status)

    - _Requirements: 9.4_

  - [x] 13.4 Add UpdateMerchantResponse interface

    - Define response structure (merchantId, status, message)
    - _Requirements: 10.5_


  - [ ] 13.5 Add MerchantFormData interface
    - Define form data structure for both create and edit modes
    - _Requirements: 9.2, 10.2, 12.1_

  - [ ] 13.6 Add ValidationErrors interface
    - Define structure for form validation errors
    - _Requirements: 9.6, 12.3_

- [x] 14. Create MerchantForm component






  - [x] 14.1 Implement MerchantForm component structure

    - Create component with create/edit mode support
    - Add form state management
    - Implement form field rendering
    - Add submit and cancel handlers
    - _Requirements: 12.1, 12.5_

  - [ ]* 14.2 Write property test for form mode
    - **Property 36: MerchantForm mode determined by merchant prop**
    - **Validates: Requirements 12.1**

  - [ ]* 14.3 Write property test for callback invocation
    - **Property 39: Form calls appropriate callback based on mode**
    - **Validates: Requirements 12.5**


  - [ ] 14.4 Implement form validation logic
    - Add validation for required fields (name, email, phone, address, city, country)
    - Add email format validation
    - Add phone format validation
    - Clear errors when user types
    - _Requirements: 9.6, 9.7, 9.8, 10.7, 12.2_

  - [ ]* 14.5 Write property test for required field validation
    - **Property 26: Required field validation prevents submission**
    - **Validates: Requirements 9.6, 10.7, 12.2**

  - [ ]* 14.6 Write property test for email validation
    - **Property 27: Email validation rejects invalid formats**
    - **Validates: Requirements 9.7**

  - [ ]* 14.7 Write property test for phone validation
    - **Property 28: Phone validation rejects invalid formats**
    - **Validates: Requirements 9.8**


  - [ ] 14.8 Implement inline error display
    - Display validation errors next to relevant fields
    - Style error messages appropriately
    - _Requirements: 12.3_

  - [ ]* 14.9 Write property test for inline error display
    - **Property 37: Validation errors display inline**

    - **Validates: Requirements 12.3**

  - [x] 14.10 Implement submit button state management

    - Disable submit button during submission
    - Show loading state on button
    - _Requirements: 12.4_

  - [x]* 14.11 Write property test for submit button state

    - **Property 38: Submit button disabled during submission**
    - **Validates: Requirements 12.4**

  - [x] 14.12 Implement confirmation dialog for edits

    - Show confirmation dialog before submitting edits
    - Handle confirmation and cancellation
    - _Requirements: 10.8_


  - [ ]* 14.13 Write property test for confirmation dialog
    - **Property 33: Edit form shows confirmation dialog**
    - **Validates: Requirements 10.8**

  - [x] 14.14 Implement API error display


    - Display API errors to user
    - Keep form data intact on error
    - _Requirements: 9.5, 10.6, 12.6_

  - [ ]* 14.15 Write property test for API error display
    - **Property 40: Form displays API errors**
    - **Validates: Requirements 12.6**

  - [ ]* 14.16 Write unit tests for MerchantForm
    - Test form rendering in create mode
    - Test form rendering in edit mode
    - Test validation logic
    - Test submit handling
    - Test error display
    - _Requirements: 9.2, 10.1, 12.1, 12.2, 12.3_

- [x] 15. Create MerchantCard component




  - [x] 15.1 Implement MerchantCard component


    - Display merchant name, code, status
    - Display contact information (email, phone)
    - Display business type and website
    - Display location information
    - Add edit button
    - _Requirements: 11.1, 11.2, 11.3_

  - [ ]* 15.2 Write property test for card information display
    - **Property 34: MerchantCard displays required information**
    - **Validates: Requirements 11.1, 11.2**


  - [x] 15.3 Implement status badge styling

    - Apply consistent CSS classes for status badges
    - Style active, inactive, and pending states
    - _Requirements: 11.4_

  - [ ]* 15.4 Write property test for status badge styling
    - **Property 35: MerchantCard applies status badge styling**
    - **Validates: Requirements 11.4**

  - [ ]* 15.5 Write unit tests for MerchantCard
    - Test card renders with merchant data
    - Test edit button click handler
    - Test status badge rendering
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 16. Integrate MerchantForm into Merchants page




  - [x] 16.1 Add "Add Merchant" button to Merchants page


    - Add button to open create form
    - Manage modal state
    - _Requirements: 9.1_


  - [x] 16.2 Add edit functionality to merchant table

    - Add edit button to each merchant row
    - Handle edit button click to open form
    - Pre-populate form with merchant data
    - _Requirements: 10.1, 11.5_

  - [ ]* 16.3 Write property test for edit form pre-population
    - **Property 29: Edit form pre-populates with merchant data**
    - **Validates: Requirements 10.1**


  - [x] 16.4 Implement create merchant flow


    - Handle form submission
    - Call createMerchant service function
    - Display success notification
    - Reset form on success
    - Refresh merchant list
    - _Requirements: 9.3, 9.4_

  - [ ]* 16.5 Write property test for create flow
    - **Property 23: Form submission sends POST request with valid data**
    - **Validates: Requirements 9.3**

  - [ ]* 16.6 Write property test for successful creation
    - **Property 24: Successful creation resets form and shows notification**
    - **Validates: Requirements 9.4**

  - [ ]* 16.7 Write property test for creation error handling
    - **Property 25: Creation error preserves form data**
    - **Validates: Requirements 9.5**


  - [x] 16.8 Implement update merchant flow


    - Handle form submission
    - Call updateMerchant service function
    - Display success notification
    - Refresh merchant list
    - _Requirements: 10.4, 10.5_

  - [ ]* 16.9 Write property test for update flow
    - **Property 30: Edit submission sends PUT request with updated data**
    - **Validates: Requirements 10.4**

  - [ ]* 16.10 Write property test for successful update
    - **Property 31: Successful update shows notification and refreshes list**
    - **Validates: Requirements 10.5**

  - [ ]* 16.11 Write property test for update error handling
    - **Property 32: Update error preserves form data**
    - **Validates: Requirements 10.6**

  - [ ]* 16.12 Write integration tests for merchant management flows
    - Test complete create flow: open form → fill → submit → success
    - Test complete edit flow: click edit → modify → confirm → success
    - Test error scenarios for both flows
    - _Requirements: 9.1, 9.3, 9.4, 10.1, 10.4, 10.5_

- [x] 17. Create styles for new components




  - [x] 17.1 Create MerchantForm.css


    - Style form modal and overlay
    - Style form fields and labels
    - Style validation error messages
    - Style submit and cancel buttons
    - Style confirmation dialog
    - Ensure responsive design
    - _Requirements: 9.2, 12.3_

  - [x] 17.2 Create MerchantCard.css


    - Style card container and layout
    - Style merchant information rows
    - Style status badges
    - Style edit button
    - Ensure responsive design
    - _Requirements: 11.1, 11.4_

- [x] 18. Final Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 19. Add merchant details type definitions





  - [x] 19.1 Add MerchantStatistics interface to merchant types


    - Define totalTransactions, totalVolume, averageTransactionValue, successRate, lastTransactionDate
    - _Requirements: 14.3_



  - [ ] 19.2 Add MerchantActivity interface to merchant types
    - Define activityId, merchantId, activityType, description, performedBy, timestamp, metadata


    - _Requirements: 14.5_

  - [ ] 19.3 Add MerchantActivityResponse interface
    - Define activities array and pagination info
    - _Requirements: 14.5_

- [x] 20. Add merchant details service functions





  - [x] 20.1 Add getMerchantStatistics placeholder function


    - Implement placeholder that returns empty statistics
    - Add TODO comment for future API endpoint
    - _Requirements: 14.3_

  - [ ]* 20.2 Write property test for statistics service
    - **Property 48: Details page displays transaction statistics**
    - **Validates: Requirements 14.3**

  - [x] 20.3 Add getMerchantActivities placeholder function


    - Implement placeholder that returns empty activities array
    - Add TODO comment for future API endpoint
    - _Requirements: 14.5_

  - [ ]* 20.4 Write property test for activities service
    - **Property 50: Details page displays activity timeline**
    - **Validates: Requirements 14.5**

  - [x] 20.5 Add exportMerchantTransactions placeholder function


    - Implement placeholder that throws error with message
    - Add TODO comment for future API endpoint
    - _Requirements: 14.6_

  - [ ]* 20.6 Write property test for export service
    - **Property 51: Export button downloads transaction history**
    - **Validates: Requirements 14.6**

  - [ ]* 20.7 Write unit tests for merchant details service functions
    - Test getMerchantStatistics returns placeholder data
    - Test getMerchantActivities returns empty array
    - Test exportMerchantTransactions throws error
    - _Requirements: 14.3, 14.5, 14.6_

- [x] 21. Create MerchantDetails component







  - [x] 21.1 Implement MerchantDetails component structure


    - Set up component with route parameter handling
    - Add state management for merchant, statistics, activities, transactions
    - Implement data fetching in useEffect
    - Add loading and error states
    - _Requirements: 14.1, 14.2_

  - [ ]* 21.2 Write property test for navigation to details
    - **Property 46: Merchant click navigates to details page**
    - **Validates: Requirements 14.1**

  - [x] 21.3 Implement merchant profile section

    - Display all merchant information fields
    - Format data consistently
    - _Requirements: 14.2_

  - [ ]* 21.4 Write property test for profile display
    - **Property 47: Details page displays all merchant information**
    - **Validates: Requirements 14.2**

  - [x] 21.5 Implement transaction statistics section

    - Display statistics in grid layout
    - Handle placeholder data gracefully
    - _Requirements: 14.3_

  - [x] 21.6 Implement recent transactions section

    - Use TransactionList component
    - Add export button
    - Handle export errors gracefully
    - _Requirements: 14.4, 14.6_

  - [ ]* 21.7 Write property test for transactions display
    - **Property 49: Details page displays recent transactions**
    - **Validates: Requirements 14.4**

  - [x] 21.8 Implement activity timeline section

    - Display activities in chronological order
    - Add activity type icons
    - Handle empty state
    - _Requirements: 14.5_

  - [x] 21.9 Implement back button






    - Add navigation back to merchant list
    - _Requirements: 14.7_

  - [ ]* 21.10 Write property test for back button
    - **Property 52: Back button returns to merchant list**
    - **Validates: Requirements 14.7**

  - [ ]* 21.11 Write unit tests for MerchantDetails component
    - Test component renders with mock data
    - Test loading state
    - Test error state
    - Test export button click
    - Test back button navigation
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

- [x] 22. Create MerchantDetails styles






  - [x] 22.1 Create MerchantDetails.css

    - Style page layout and header
    - Style merchant profile grid
    - Style statistics grid
    - Style transactions section
    - Style activity timeline
    - Ensure responsive design
    - _Requirements: 14.2, 14.3, 14.4, 14.5_

- [x] 23. Add routing for merchant details




  - [x] 23.1 Add route for /merchants/:id

    - Configure React Router route
    - _Requirements: 14.1_

  - [x] 23.2 Update MerchantList to link to details

    - Make merchant rows clickable
    - Navigate to details page on click
    - _Requirements: 14.1_

  - [ ]* 23.3 Write integration test for merchant details flow
    - Test complete flow: click merchant → load details → view all sections → back to list
    - Test error handling
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.7_

- [x] 24. Final Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
