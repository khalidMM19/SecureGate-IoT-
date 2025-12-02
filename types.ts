export enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  WARNING = 'WARNING',
  MAINTENANCE = 'MAINTENANCE'
}

export enum DeviceType {
  SENSOR = 'SENSOR',
  ACTUATOR = 'ACTUATOR',
  CAMERA = 'CAMERA',
  GATEWAY = 'GATEWAY'
}

export interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  type: DeviceType;
  status: DeviceStatus;
  lastSeen: string;
  firmware: string;
}

export enum SecuritySeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  SUCCESS = 'SUCCESS'
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  sourceIp: string;
  event: string;
  severity: SecuritySeverity;
  protocol: string;
}

export interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  temp: number;
  networkIn: number; // Mbps
  networkOut: number; // Mbps
}

export interface AiAnalysisResult {
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  recommendations: string[];
  affectedProtocols: string[];
}
