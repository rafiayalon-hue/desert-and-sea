import { Card, Statistic } from "antd";

export default function StatCard({ title, value, prefix, suffix, color, loading }) {
  return (
    <Card style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }} loading={loading}>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ color: color ?? "#1a6b5a", fontWeight: 600 }}
      />
    </Card>
  );
}
