<?php
require_once '../config/database.php';

class CemeteryFunctions {
    private $db;
    
    public function __construct() {
        $this->db = new Database();
    }
    
    // Dashboard Statistics
    public function getDashboardStats() {
        try {
            $stats = [];
            
            // Total burials
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM burials");
            $stats['total_burials'] = $stmt->fetch()['total'];
            
            // Fresh bodies count
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM burials WHERE burial_type = 'fresh_body'");
            $stats['fresh_bodies'] = $stmt->fetch()['total'];
            
            // Bones count
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM burials WHERE burial_type = 'bones'");
            $stats['bones'] = $stmt->fetch()['total'];
            
            // Occupied plots
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM graves WHERE status = 'occupied'");
            $stats['occupied_plots'] = $stmt->fetch()['total'];
            
            // Available plots
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM graves WHERE status = 'available'");
            $stats['available_plots'] = $stmt->fetch()['total'];
            
            // Open inquiries
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM inquiries WHERE status = 'unread'");
            $stats['open_inquiries'] = $stmt->fetch()['total'];
            
            // Maintenance tasks
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM maintenance WHERE status IN ('scheduled', 'in_progress')");
            $stats['maintenance_tasks'] = $stmt->fetch()['total'];
            
            return $stats;
        } catch (Exception $e) {
            return [];
        }
    }
    
    // Get recent activities
    public function getRecentActivities($limit = 10) {
        try {
            $stmt = $this->db->query(
                "SELECT al.*, u.first_name, u.last_name 
                 FROM activity_logs al 
                 JOIN users u ON al.user_id = u.id 
                 ORDER BY al.date_created DESC 
                 LIMIT ?",
                [$limit]
            );
            return $stmt->fetchAll();
        } catch (Exception $e) {
            return [];
        }
    }
    
    // Get upcoming tasks
    public function getUpcomingTasks($limit = 10) {
        try {
            $stmt = $this->db->query(
                "SELECT m.*, g.plot_number, pt.name as plot_type 
                 FROM maintenance m 
                 JOIN graves g ON m.grave_id = g.id 
                 JOIN plot_types pt ON g.plot_type_id = pt.id 
                 WHERE m.status IN ('scheduled', 'in_progress') 
                 AND m.start_date >= CURDATE() 
                 ORDER BY m.start_date ASC 
                 LIMIT ?",
                [$limit]
            );
            return $stmt->fetchAll();
        } catch (Exception $e) {
            return [];
        }
    }
    
    // Get all plot types
    public function getPlotTypes() {
        try {
            $stmt = $this->db->query("SELECT * FROM plot_types WHERE status = 'active' ORDER BY name");
            return $stmt->fetchAll();
        } catch (Exception $e) {
            return [];
        }
    }
    
    // Format currency
    public function formatCurrency($amount) {
        return '₱' . number_format($amount, 2);
    }
    
    // Format date
    public function formatDate($date) {
        return date('F j, Y', strtotime($date));
    }
    
    // Format datetime
    public function formatDateTime($datetime) {
        return date('F j, Y g:i A', strtotime($datetime));
    }
    
    // Generate plot number
    public function generatePlotNumber($plotTypeId) {
        try {
            $stmt = $this->db->query("SELECT name FROM plot_types WHERE id = ?", [$plotTypeId]);
            $plotType = $stmt->fetch();
            
            if (!$plotType) return null;
            
            // Get the prefix based on plot type
            $prefix = '';
            switch ($plotType['name']) {
                case 'Lawn Lots':
                    $prefix = 'LL';
                    break;
                case 'Garden Lots':
                    $prefix = 'GL';
                    break;
                case 'Mini Mausoleum Lot':
                    $prefix = 'MML';
                    break;
                case 'Mausoleum Lot':
                    $prefix = 'ML';
                    break;
                case 'Rental Apartment Niche':
                    $prefix = 'RAN';
                    break;
                default:
                    $prefix = 'P';
            }
            
            // Get the next number
            $stmt = $this->db->query(
                "SELECT COUNT(*) + 1 as next_num FROM graves g 
                 JOIN plot_types pt ON g.plot_type_id = pt.id 
                 WHERE pt.id = ?",
                [$plotTypeId]
            );
            $nextNum = $stmt->fetch()['next_num'];
            
            return $prefix . str_pad($nextNum, 4, '0', STR_PAD_LEFT);
        } catch (Exception $e) {
            return null;
        }
    }
    
    // Get system settings
    public function getSetting($key) {
        try {
            $stmt = $this->db->query("SELECT setting_value FROM settings WHERE setting_key = ?", [$key]);
            $result = $stmt->fetch();
            return $result ? $result['setting_value'] : null;
        } catch (Exception $e) {
            return null;
        }
    }
}
?>