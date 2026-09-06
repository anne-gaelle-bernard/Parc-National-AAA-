<?php

use PHPUnit\Framework\TestCase;

/**
 * The Visitor feature (Backend/models/Visitor.php, VisitorController, and
 * the routes under Backend/src/routes/visitorRoutes.php) is still an empty
 * stub — there is no logic to test yet. This is intentionally marked
 * incomplete rather than faked, so it shows up in CI output as a reminder.
 */
class VisitorTest extends TestCase {
    public function testVisitorFeatureIsNotYetImplemented(): void {
        $this->markTestIncomplete(
            'Visitor model/controller/routes are still empty stubs (see Backend/models/Visitor.php).'
        );
    }
}
