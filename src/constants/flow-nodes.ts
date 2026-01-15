import { type FlowNodeType } from '@/ui/molecules/FlowEditor';

export const ALGORITHM_NODES: FlowNodeType[] = [
  {
    type: 'start',
    label: 'Bắt đầu',
    description: 'Bắt đầu thuật toán',
    initialData: { label: 'START' },
  },
  {
    type: 'process',
    label: 'Quy trình',
    description: 'Thao tác xử lý dữ liệu',
    initialData: { label: 'sum = a + b' },
  },
  {
    type: 'input',
    label: 'Nhập dữ liệu',
    description: 'Nhập dữ liệu từ người dùng',
    initialData: { label: 'Input x' },
  },
  {
    type: 'output',
    label: 'Xuất dữ liệu',
    description: 'Xuất dữ liệu ra màn hình',
    initialData: { label: 'Output result' },
  },
  {
    type: 'decision',
    label: 'Quyết định',
    description: 'Điều kiện rẽ nhánh',
    initialData: { label: 'x > 0?' },
  },
  {
    type: 'merge',
    label: 'Hợp nhất',
    description: 'Gộp các nhánh luồng',
    initialData: { label: 'Merge' },
  },
  {
    type: 'loopback',
    label: 'Vòng lặp',
    description: 'Quay lại điểm trước đó',
    initialData: { label: 'Loop' },
  },
  {
    type: 'end',
    label: 'Kết thúc',
    description: 'Kết thúc thuật toán',
    initialData: { label: 'END' },
  },
];
