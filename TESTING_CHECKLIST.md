# LoadOptions Implementation - Manual Testing Checklist

**Testing Date**: _____________
**Tester**: _____________
**n8n Version**: _____________
**Node Version**: 0.1.0
**n8n URL**: http://localhost:5678

---

## Pre-Testing Setup

- [ ] n8n is running and accessible at http://localhost:5678
- [ ] Baramundi credentials are configured in n8n
- [ ] Access to baramundi Management Suite (bms-win22srv:444)
- [ ] Test workflow created/available

---

## Test 1: Endpoint Operations - Basic Dropdown Functionality

### 1.1 Get Endpoint Operation

- [ ] **Open n8n** → Create new workflow
- [ ] **Add Baramundi node** to canvas
- [ ] **Configure credentials** (if not already configured)
- [ ] **Select Resource**: `Endpoint`
- [ ] **Select Operation**: `Get`
- [ ] **Observe Endpoint Selection field**:
  - [ ] Field displays as dropdown (not text input)
  - [ ] Field label shows "Endpoint Selection"
  - [ ] Field has helpful description
- [ ] **Click dropdown** to open options:
  - [ ] Dropdown shows "Loading..." indicator (briefly)
  - [ ] Dropdown populates with endpoints from API
  - [ ] Endpoints show DisplayName (human-readable)
  - [ ] At least one endpoint is visible
  - [ ] Last option is "Enter Custom GUID..."
- [ ] **Test search functionality**:
  - [ ] Type partial endpoint name in dropdown
  - [ ] Results filter to matching endpoints
  - [ ] Clear search shows all endpoints again
- [ ] **Select an endpoint from dropdown**:
  - [ ] Endpoint is selected successfully
  - [ ] GUID value is populated (visible in expression editor)
  - [ ] Endpoint ID field does NOT appear (only visible for custom mode)
- [ ] **Execute the node**:
  - [ ] ✅ Node executes successfully
  - [ ] ✅ Returns endpoint data
  - [ ] ✅ Data matches selected endpoint

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

### 1.2 Custom GUID Input Mode (Endpoint)

- [ ] **Keep same node configuration** (Resource: Endpoint, Operation: Get)
- [ ] **Click Endpoint Selection dropdown**
- [ ] **Select "Enter Custom GUID..."** option
- [ ] **Observe field changes**:
  - [ ] New field "Endpoint ID" appears below
  - [ ] Field is text input (not dropdown)
  - [ ] Field shows placeholder or description
- [ ] **Enter a valid endpoint GUID** (copy from previous test):
  - [ ] GUID: ___________________________________________
  - [ ] Input accepts the GUID
- [ ] **Execute the node**:
  - [ ] ✅ Node executes successfully
  - [ ] ✅ Returns same endpoint data as dropdown selection
  - [ ] ✅ Behavior is identical to dropdown mode

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

### 1.3 Other Endpoint Operations with Dropdowns

Test the same dropdown functionality for these operations:

#### Update Endpoint
- [ ] Resource: `Endpoint`, Operation: `Update`
- [ ] Endpoint Selection dropdown loads ✅
- [ ] Select endpoint from dropdown ✅
- [ ] Configure Update Fields (e.g., comment)
- [ ] Execute successfully ✅

#### Start Enrollment
- [ ] Resource: `Endpoint`, Operation: `Start Enrollment`
- [ ] Endpoint Selection dropdown loads ✅
- [ ] Select endpoint from dropdown ✅
- [ ] Configure enrollment options
- [ ] Execute successfully ✅

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

## Test 2: Job Operations - Basic Dropdown Functionality

### 2.1 Get Job Definition Operation

- [ ] **Add new Baramundi node** (or reconfigure existing)
- [ ] **Select Resource**: `Job`
- [ ] **Select Operation**: `Get`
- [ ] **Observe Job Selection field**:
  - [ ] Field displays as dropdown
  - [ ] Field label shows "Job Selection"
- [ ] **Click dropdown** to open options:
  - [ ] Dropdown shows "Loading..." indicator
  - [ ] Dropdown populates with job definitions
  - [ ] Jobs show name AND type (e.g., "Windows Update [Deployment]")
  - [ ] At least one job is visible
  - [ ] Last option is "Enter Custom GUID..."
- [ ] **Test search functionality**:
  - [ ] Type partial job name
  - [ ] Results filter correctly
- [ ] **Select a job from dropdown**:
  - [ ] Job is selected
  - [ ] GUID value is populated
- [ ] **Execute the node**:
  - [ ] ✅ Node executes successfully
  - [ ] ✅ Returns job definition data
  - [ ] ✅ Data matches selected job

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

### 2.2 Execute Job Operation

- [ ] **Reconfigure node**: Resource: `Job`, Operation: `Execute`
- [ ] **Observe Job Selection dropdown**:
  - [ ] Dropdown loads successfully
  - [ ] Shows jobs with type labels
- [ ] **Select a job from dropdown**
- [ ] **Configure Endpoint IDs** (comma-separated or single):
  - [ ] Endpoint IDs: ___________________________________________
- [ ] **Execute the node**:
  - [ ] ✅ Node executes successfully
  - [ ] ✅ Job starts on specified endpoints
  - [ ] ✅ Returns job instance data

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

### 2.3 Get Job Instances Operation

- [ ] **Reconfigure node**: Resource: `Job`, Operation: `Get Instances`
- [ ] **Job Selection dropdown** loads ✅
- [ ] **Select a job** that has been executed before
- [ ] **Execute the node**:
  - [ ] ✅ Returns list of job instances
  - [ ] ✅ Instances match the selected job

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

### 2.4 Create Kiosk Release Operation (Special Case)

- [ ] **Reconfigure node**: Resource: `Job`, Operation: `Create Kiosk Release`
- [ ] **Observe field label**: Should be "Job Definition Selection" (not "Job Selection")
- [ ] **Dropdown loads** job definitions ✅
- [ ] **Select a job** from dropdown
- [ ] **Configure**:
  - [ ] Target Type: (Endpoint/LogicalGroup/etc.)
  - [ ] Target ID: ___________________________________________
- [ ] **Execute the node**:
  - [ ] ✅ Creates kiosk release successfully
  - [ ] ✅ Returns release data

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

### 2.5 Update Job & Delete Job Operations

#### Update Job
- [ ] Resource: `Job`, Operation: `Update`
- [ ] Job Selection dropdown loads ✅
- [ ] Select job from dropdown ✅
- [ ] Configure Update Fields
- [ ] Execute successfully ✅

#### Delete Job
- [ ] Resource: `Job`, Operation: `Delete`
- [ ] Job Selection dropdown loads ✅
- [ ] Select job from dropdown ✅
- [ ] Execute successfully (⚠️ WARNING: Actually deletes the job!)
- [ ] **Skip this test** if no test job available

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

## Test 3: Error Handling & Edge Cases

### 3.1 Invalid Credentials

- [ ] **Configure node with invalid credentials**:
  - [ ] Resource: `Endpoint`, Operation: `Get`
  - [ ] Click Endpoint Selection dropdown
- [ ] **Expected behavior**:
  - [ ] Dropdown shows empty/error state
  - [ ] OR shows "Enter Custom GUID..." only
  - [ ] Error message is helpful (if shown)

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

### 3.2 Network/API Unavailable

- [ ] **Stop baramundi service temporarily** (if possible) OR disconnect network
- [ ] **Try to load dropdown**
- [ ] **Expected behavior**:
  - [ ] Dropdown handles error gracefully
  - [ ] Fallback to "Enter Custom GUID..." still available
  - [ ] User can still enter GUID manually

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

### 3.3 Empty Results (No Endpoints/Jobs)

- [ ] **If test environment has no endpoints/jobs**:
  - [ ] Dropdown shows empty state
  - [ ] "Enter Custom GUID..." option still available
  - [ ] User can proceed with manual GUID

**Result**: ✅ PASS / ❌ FAIL / ⏭️ SKIPPED (not applicable)
**Notes**: ___________________________________________

---

### 3.4 Large Result Sets (100+ Items)

- [ ] **If baramundi has 100+ endpoints/jobs**:
  - [ ] Dropdown loads top 100 items
  - [ ] Dropdown is still responsive (no lag)
  - [ ] Search/filter works efficiently
  - [ ] Items are sorted by name (ascending)

**Result**: ✅ PASS / ❌ FAIL / ⏭️ SKIPPED (< 100 items)
**Notes**: ___________________________________________

---

## Test 4: Workflow Integration

### 4.1 Multi-Node Workflow

- [ ] **Create workflow with multiple Baramundi nodes**:
  1. Node 1: Get endpoints (use dropdown)
  2. Node 2: Update endpoint (use dropdown)
  3. Node 3: Execute job on endpoint (use dropdown)
- [ ] **Connect nodes** with expressions/data flow
- [ ] **Execute entire workflow**:
  - [ ] ✅ All nodes execute in sequence
  - [ ] ✅ Data flows correctly between nodes
  - [ ] ✅ Dropdowns work in all nodes

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

### 4.2 Save & Reload Workflow

- [ ] **Configure node with dropdown selection** (select an endpoint/job)
- [ ] **Save workflow**
- [ ] **Close workflow** (navigate away)
- [ ] **Reload workflow** (open again)
- [ ] **Verify**:
  - [ ] Selected value is preserved
  - [ ] Node configuration loads correctly
  - [ ] Dropdown still works after reload

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

## Test 5: User Experience

### 5.1 Dropdown Performance

- [ ] **Dropdown opens** within 2 seconds ✅
- [ ] **Dropdown scrolling** is smooth ✅
- [ ] **Search/filter** responds instantly ✅
- [ ] **No UI freezing** during load ✅

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

### 5.2 Visual Design

- [ ] **Dropdown styling** matches n8n design system ✅
- [ ] **Font, colors, spacing** are consistent ✅
- [ ] **Loading indicator** is visible and clear ✅
- [ ] **Selection highlighting** works properly ✅

**Result**: ✅ PASS / ❌ FAIL
**Notes**: ___________________________________________

---

### 5.3 Accessibility

- [ ] **Keyboard navigation**:
  - [ ] Arrow keys navigate dropdown options ✅
  - [ ] Enter key selects option ✅
  - [ ] Escape key closes dropdown ✅
  - [ ] Tab key moves to next field ✅
- [ ] **Screen reader** (if available):
  - [ ] Dropdown is announced correctly
  - [ ] Selected value is announced

**Result**: ✅ PASS / ❌ FAIL / ⏭️ SKIPPED
**Notes**: ___________________________________________

---

## Summary

### Test Results

| Test Section | Status | Notes |
|-------------|--------|-------|
| Test 1: Endpoint Dropdowns | ✅ / ❌ | |
| Test 2: Job Dropdowns | ✅ / ❌ | |
| Test 3: Error Handling | ✅ / ❌ | |
| Test 4: Workflow Integration | ✅ / ❌ | |
| Test 5: User Experience | ✅ / ❌ | |

### Issues Found

1. _______________________________________________________
2. _______________________________________________________
3. _______________________________________________________

### Overall Assessment

- [ ] ✅ **PASS** - Ready for production
- [ ] ⚠️ **PASS WITH MINOR ISSUES** - Non-blocking issues found
- [ ] ❌ **FAIL** - Blocking issues found, needs fixes

### Recommendations

_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

## Next Steps

- [ ] Document issues in GitHub/tracking system
- [ ] Create screenshots for successful tests
- [ ] Update README with feature documentation
- [ ] Consider additional enhancements based on testing feedback

---

**Tested by**: _____________
**Date**: _____________
**Signature**: _____________
